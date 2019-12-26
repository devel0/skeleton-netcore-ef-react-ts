import React from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Grid, Tooltip, CircularProgress, InputBase } from '@material-ui/core';
import * as icons from '@material-ui/icons';
import { commonStyles } from '../Styles/Styles';
import { FaSignOutAlt } from 'react-icons/fa';
import packageJson from '../../package.json';
import { useSystem } from './store/SystemStore';
import { useHistory } from 'react-router-dom';

export const appVersion = packageJson.version;

interface ownProps {

}

type MyAppBarProps = ownProps;

// EP: STYLE THEME
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      width: 25
    },
    grow: {
      flexGrow: 1,
    },
    menuButtonZone: {
      width: 50
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    menuButton2: {
      cursor: 'pointer',
      marginRight: theme.spacing(2),
    },
    titleEver: {
      display: 'block',
      padding: 0,
    },
    subtitleVersion: {
      padding: 0,
      lineHeight: 0.5
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
      marginRight: theme.spacing(2),
      marginLeft: "1em",
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
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
  }),
);

export default function MyAppBar() {
  const system = useSystem();

  const history = useHistory();
  const classes = useStyles();
  const cclasses = commonStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  //let history = useHistory();

  function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const onProfileClick = () => {
    handleMenuClose();
    history.push("/user-profile");
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => onProfileClick()}>Profile</MenuItem>
      <MenuItem onClick={() => {
        //logout(system);
        history.push("/login");
        handleMenuClose();
      }}><FaSignOutAlt className={cclasses.leftIcon} /> Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <NotificationsIcon /> Notifications
      </MenuItem>
      <MenuItem onClick={() => { handleMobileMenuClose(); history.push("user-profile"); }}>
        <AccountCircle className={cclasses.leftIcon} /> Profile
      </MenuItem>
      <MenuItem onClick={() => {
        //logout(system);
        history.push("/login");
        handleMenuClose();
      }}>
        <FaSignOutAlt className={cclasses.leftIcon} /> Logout
        </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          {/* PROGRESS */}
          <Grid item={true} style={{ marginRight: "1em" }}>
            <CircularProgress style={{ color: "white" }} size={20}
              className={system.state.loading ? "visible" : "invisible"} />
          </Grid>

          {/* TITLE + VERSION */}
          <Grid container={true} direction="column" className={classes.menuButtonZone} style={{ marginRight: "1em" }}>
            <Grid item={true}>
              <Typography className={classes.titleEver} variant="h6" noWrap>
                srvapp
              </Typography>
            </Grid>
            <Grid item={true} className={classes.subtitleVersion}>
              <small className={cclasses.spaceRight1}>v.{appVersion}</small>
            </Grid>
          </Grid>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <icons.Search />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>            
            <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Tooltip title={<span style={{ fontSize: "1.5em" }}>Username</span>} arrow>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>

        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}