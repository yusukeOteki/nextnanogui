import React from 'react';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import CreateNewFolder from '@material-ui/icons/CreateNewFolder';
import FolderOpen from '@material-ui/icons/FolderOpen';
import Save from '@material-ui/icons/Save';
import Edit from '@material-ui/icons/Edit';
import Play from '@material-ui/icons/PlayCircleOutline';
import Assessment from '@material-ui/icons/Assessment';
import Settings from '@material-ui/icons/Settings';
import Looks3 from '@material-ui/icons/Looks3';

const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('electron').remote;

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class PrimarySearchAppBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
    };

    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    this.handleSaveJson = this.handleSaveJson.bind(this);
    this.handleSaveN3 = this.handleSaveN3.bind(this);
    this.handleCreateFile = this.handleCreateFile.bind(this);
    this.handleOpenFile = this.handleOpenFile.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    //const propsDiff = isEqual(nextProps, this.props);
    const stateDiff = isEqual(nextState, this.state);
    //console.log("propsDiff", propsDiff)
    //console.log("stateDiff", stateDiff)
    //console.log(!(propsDiff && stateDiff))
    //return !(propsDiff && stateDiff);
    return !stateDiff;
  }

  handleProfileMenuOpen(event) {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose() {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen(event) {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose() {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleSaveJson(e) {
    if (this.props.mode === "input") {
      let options = {
        title: "Save  json input file",
        defaultPath: 'filename.json',
        filters: [
          { name: 'nextnano3', extensions: ['json'] },
        ]
      };
      let that = this;
      dialog.showSaveDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('saveInputFile', filename, that.props.jsonfile);
      });
    }else if(this.props.mode === "output"){
      let options = {
        title: "Save  json output file",
        defaultPath: 'outputData.json',
        filters: [
          { name: 'nextnano3', extensions: ['json'] },
        ]
      };
      let that = this;
      dialog.showSaveDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('saveInputFile', filename, JSON.stringify({output: that.props.output, data: that.props.data}));
      });
    }
  };

  handleSaveN3(e) {
    if (this.props.mode === "input") {
      let options = {
        title: "Save nextnano3 input file",
        defaultPath: 'filename.in',
        filters: [
          { name: 'nextnano3', extensions: ['in'] },
        ]
      };
      let that = this;
      dialog.showSaveDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('saveInputFile', filename, that.props.n3file);
      });
    }else{
      let options = {
        title: "Save dat file",
        defaultPath: 'filename.dat',
        filters: [
          { name: 'nextnano3', extensions: ['dat'] },
        ]
      };
      let that = this;
      dialog.showSaveDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('saveInputFile', filename, that.props.outputDat);
      });
    }
  };

  handleCreateFile(e) {
    if (this.props.mode === "input") {
      //initial
    }else if(this.props.mode === "output"){
      let options = {
        title: "Open folder",
        properties: ['openDirectory']
      };
      let that = this;
      dialog.showOpenDialog(options, function (filenames) {
        ipcRenderer.send('mul-async-dialog', filenames);
        ipcRenderer.on('mul-async-dialog-replay', (event, directoryPath, directoryContents, isOutputData) => {
            that.props.onEventCallBack({ output: {directoryPath, directoryContents}, data: [], isOutputData: 0}, 'output');
        });
      });
    }
  }

  handleOpenFile(e) {
    if (this.props.mode === "input") {
      let options = {
        title: "Open folder",
        properties: ['openFile'],
      };
      let that = this;
      dialog.showOpenDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('openInputFile', filename);
        ipcRenderer.on('openInputFile-replay', (event, path, content) => {
          that.props.onEventCallBack(content, path.split('.')[path.split('.').length - 1])
        });
      });
    }else if(this.props.mode === "output"){
      let options = {
        title: "Open folder",
        properties: ['openFile'],
      };
      let that = this;
      dialog.showOpenDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('openInputFile', filename);
        ipcRenderer.on('openInputFile-replay', (event, path, content) => {
          let outputData = JSON.parse(content);
          that.props.onEventCallBack({ output: outputData.output, data: outputData.data, isOutputData: 1 }, 'output');
        });
      });
    }
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes, changeMode } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleClose}>My account</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
            <Badge className={classes.margin} badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <Badge className={classes.margin} badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="title" color="inherit" noWrap>
              Material-UI
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton color="inherit" onClick={e => this.handleCreateFile(e)} >
                <CreateNewFolder />
              </IconButton>
              <IconButton color="inherit" onClick={e => this.handleOpenFile(e)} >
                <FolderOpen />
              </IconButton>
              <IconButton color="inherit" onClick={e => this.handleSaveJson(e)} >
                <Save />
              </IconButton>
              <IconButton color="inherit" onClick={e => this.handleSaveN3(e)} >
                <Looks3 />
              </IconButton>
              <IconButton color="inherit">
                <Undo />
              </IconButton>
              <IconButton color="inherit">
                <Redo />
              </IconButton>
            </div>

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton color="inherit" onClick={e => changeMode("input")}>
                <Edit />
              </IconButton>
              <IconButton color="inherit">
                <Play />
              </IconButton>
              <IconButton color="inherit" onClick={e => changeMode("output")}>
                <Assessment />
              </IconButton>
              <IconButton color="inherit">
                <Settings />
              </IconButton>
            </div>

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <Input
                placeholder="Search…"
                disableUnderline
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <div className={classes.sectionDesktop}>
              <IconButton color="inherit">
                {/*<Badge className={classes.margin} badgeContent={4} color="secondary">*/}
                <MailIcon />
                {/*</Badge>*/}
              </IconButton>
              <IconButton color="inherit">
                {/*  <Badge className={classes.margin} badgeContent={17} color="secondary"> */}
                <NotificationsIcon />
                {/* </Badge> */}
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>


            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimarySearchAppBar);
