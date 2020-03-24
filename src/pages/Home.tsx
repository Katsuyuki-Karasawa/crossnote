import {
  Box,
  CssBaseline,
  Drawer,
  Hidden,
  List,
  ListItem,
  IconButton,
  Paper,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import {
  fade,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  PlusCircle,
  Settings as SettingsIcon,
  LibraryBooks,
  Cube,
  Login,
  Bell
} from "mdi-material-ui";
import {
  CrossnoteContainer,
  SelectedSectionType
} from "../containers/crossnote";
import Editor from "../components/Editor";
import AddNotebookDialog from "../components/AddNotebookDialog";
import NotebookTreeView from "../components/NotebookTreeView";
import NotesPanel from "../components/NotesPanel";
import WikiPanel from "../components/WikiPanel";

const drawerWidth = 200;
const notesPanelWidth = 350;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    page: {
      display: "flex",
      width: "100%",
      height: "100%",
      backgroundColor: "#2196F1"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      boxShadow: "none"
    },
    toolBar: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto"
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200
      }
    },
    displayNone: {
      display: "none"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    drawerPaper: {
      width: drawerWidth
      // backgroundColor: "#2196f1",
      // color: "#fff"
    },
    selectedSection: {
      backgroundColor: "#ccc"
    },
    left: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    menuButton: {
      marginRight: theme.spacing(2)
      /*
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
      */
    },
    mainPanel: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
      overflow: "auto",
      backgroundColor: "#eee"
    },
    notesPanel: {
      width: `${notesPanelWidth}px`,
      maxWidth: "100%",
      height: "100%",
      [theme.breakpoints.down("xs")]: {
        width: "100%"
      }
    },
    editorPanel: {
      // flex: "1" // Flex has overflow issue
      width: `calc(100% - ${notesPanelWidth}px)`,
      position: "absolute",
      left: `calc(${notesPanelWidth}px)`,
      height: "100%",
      [theme.breakpoints.down("md")]: {
        width: `calc(100% - ${notesPanelWidth}px)`,
        left: `${notesPanelWidth}px`
      },
      [theme.breakpoints.down("xs")]: {
        display: "none",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%"
      }
    },
    toolBarSpace: theme.mixins.toolbar
  })
);

export enum HomeSection {
  Notebooks = "Notebooks",
  Settings = "Settings"
}

interface QueryParams {
  notebookID?: string;
  repo?: string;
  branch?: string;
}

interface Props {
  section: HomeSection;
  queryParams: QueryParams;
}

export function Home(props: Props) {
  const classes = useStyles(props);

  const [addNotebookDialogOpen, setAddNotebookDialogOpen] = useState<boolean>(
    false
  );
  const [addNotebookRepo, setAddNotebookRepo] = useState<string>("");
  const [addNotebookBranch, setAddNotebookBranch] = useState<string>("");

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const crossnoteContainer = CrossnoteContainer.useContainer();

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen]);

  useEffect(() => {
    if (!crossnoteContainer.initialized) {
      return;
    }
    if (props.section === HomeSection.Notebooks) {
      if (props.queryParams) {
        if (props.queryParams["notebookID"]) {
          const notebook = crossnoteContainer.notebooks.find(
            nb => nb._id === props.queryParams["notebookID"]
          );
          if (notebook && crossnoteContainer.selectedNotebook !== notebook) {
            crossnoteContainer.setSelectedNotebook(notebook);
          }
        } else if (props.queryParams.repo && props.queryParams.branch) {
          const repo = decodeURIComponent(props.queryParams.repo);
          const branch = decodeURIComponent(props.queryParams.branch);
          const notebook = crossnoteContainer.notebooks.find(
            nb => nb.gitURL === repo && nb.gitBranch === branch
          );
          if (notebook) {
            if (crossnoteContainer.selectedNotebook !== notebook) {
              crossnoteContainer.setSelectedNotebook(notebook);
            }
            // setAddNotebookRepo("");
            // setAddNotebookBranch("");
            // setAddNotebookDialogOpen(false);
          } else {
            // Show dialog
            setAddNotebookRepo(repo);
            setAddNotebookBranch(branch);
            setAddNotebookDialogOpen(true);
          }
        }
      }
    }
  }, [props.section, props.queryParams, crossnoteContainer.initialized]);

  const drawer = (
    <div>
      <List disablePadding={true}>
        <ListItem button>
          <ListItemIcon>
            <LibraryBooks></LibraryBooks>
          </ListItemIcon>
          <ListItemText primary={"Explore"}></ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Cube></Cube>
          </ListItemIcon>
          <ListItemText primary={"My Blocks"}></ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Bell></Bell>
          </ListItemIcon>
          <ListItemText primary={"Notifications"}></ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon></SettingsIcon>
          </ListItemIcon>
          <ListItemText primary={t("general/Settings")}></ListItemText>
        </ListItem>
        <Divider></Divider>
        <ListItem disableGutters={true}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8px"
            }}
          >
            <Typography variant={"body1"} style={{ fontWeight: "bold" }}>
              {"Notebooks"}
            </Typography>
            <IconButton onClick={() => setAddNotebookDialogOpen(true)}>
              <PlusCircle></PlusCircle>
            </IconButton>
          </Box>
        </ListItem>
        {crossnoteContainer.notebooks.map(notebook => {
          return (
            <ListItem
              disableGutters={true}
              style={{ padding: "0" }}
              key={notebook._id}
            >
              <NotebookTreeView notebook={notebook}></NotebookTreeView>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  const notesPanel =
    crossnoteContainer.selectedSection.type !== SelectedSectionType.Wiki ? (
      <Paper className={clsx(classes.notesPanel)} id={"notes-panel"}>
        <NotesPanel toggleDrawer={toggleDrawer}></NotesPanel>
      </Paper>
    ) : (
      <Paper className={clsx(classes.notesPanel)} id={"notes-panel"}>
        <WikiPanel toggleDrawer={toggleDrawer}></WikiPanel>
      </Paper>
    );

  return (
    <Box className={clsx(classes.page)}>
      <CssBaseline></CssBaseline>
      <nav className={clsx(classes.drawer, "drawer")}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={toggleDrawer}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <Box className={clsx(classes.mainPanel)} id="main-panel">
        {notesPanel}
        <Paper
          className={clsx(classes.editorPanel, "editor-panel")}
          style={{
            display: crossnoteContainer.displayMobileEditor && "block"
          }}
        >
          <Editor note={crossnoteContainer.selectedNote}></Editor>
        </Paper>
      </Box>
      <AddNotebookDialog
        open={addNotebookDialogOpen}
        onClose={() => setAddNotebookDialogOpen(false)}
        canCancel={true}
        gitURL={addNotebookRepo}
        gitBranch={addNotebookBranch}
      ></AddNotebookDialog>
    </Box>
  );
}
