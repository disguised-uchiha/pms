import {
  useTheme,
  AppBar,
  Hidden,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  makeStyles,
  Theme,
  createStyles,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import { toSnakeCase } from '../../utils/toSnakeCase';
import Requisitions from './Requisitions';
import CreateRequisition from './CreateRequisition';
import RequisitionDetail from '../../components/RequisitionDetail';
import InternalSubmitals from './InternalSubmitals';
import InternalSubmitalsList from '../../components/InternalSubmitalsList';
import { RootState } from '../../index';
import { useDispatch, useSelector } from 'react-redux';
import CompanyProfile from './CompanyProfile';
import { onLogout } from '../../store/actions/actions.auth';

interface Props {
  window?: () => Window;
}

function CompanyDashboard(props: Props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Requisitions');

  const companyState = useSelector((state: RootState) => state.companyState);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const container = window !== undefined ? () => window().document.body : undefined;

  const drawer = (
    <div
      style={{
        backgroundColor: theme.palette.primary.main,
        height: '100%',
        color: theme.palette.primary.contrastText,
      }}
    >
      <List>
        <ListItem
          button
          key='company-profile'
          className={classes.select}
          onClick={() => {
            setSelectedTab('Profile');
            mobileOpen && setMobileOpen(!mobileOpen);
            history.push('/company-dashboard/profile-details');
          }}
          selected={'Profile' === selectedTab}
        >
          <ListItemIcon>
            <Avatar
              alt={companyState.name}
              className={classes.large}
              src={baseURL + companyState.avatar}
            />
          </ListItemIcon>
          <Typography
            variant='h6'
            noWrap
            style={{ padding: '1rem', fontFamily: 'Playfair Display' }}
          >
            {companyState.name}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <List>
        {['Requisitions', 'Create Requisition', 'Internal Submitals', 'Logout'].map((text) => (
          <ListItem
            button
            key={text}
            className={classes.select}
            onClick={() => {
              if (text === 'Logout') {
                dispatch(onLogout());
                history.push('/login');
                return;
              }
              setSelectedTab(text);
              mobileOpen && setMobileOpen(!mobileOpen);
              history.push('/company-dashboard/' + toSnakeCase(text));
            }}
            selected={text === selectedTab}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Hidden smUp>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              {companyState.name} Dashboard
            </Typography>
          </Toolbar>
        </Hidden>
      </AppBar>

      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <Hidden smUp>
          <div className={classes.toolbar} />
        </Hidden>
        <Switch>
          <Route path='/company-dashboard' exact>
            <Requisitions />
          </Route>
          <Route path='/company-dashboard/requisitions'>
            <Redirect to='/company-dashboard' />
          </Route>
          <Route path='/company-dashboard/create-requisition' exact>
            <CreateRequisition />
          </Route>
          <Route path='/company-dashboard/create-requisition/:id'>
            <CreateRequisition />
          </Route>
          <Route path='/company-dashboard/internal-submitals' exact>
            <InternalSubmitals />
          </Route>
          <Route path='/company-dashboard/profile-details'>
            <CompanyProfile />
          </Route>
          <Route path='/company-dashboard/requisition-detail/:id'>
            <RequisitionDetail />
          </Route>
          <Route path='/company-dashboard/internal-submitals/requisitionId'>
            <InternalSubmitalsList />
          </Route>
        </Switch>
      </main>
    </div>
  );
}
const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    toolbar: theme.mixins.toolbar,
    select: {
      '&.MuiListItem-root.Mui-selected': {
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.main,
      },
    },
  })
);

export default CompanyDashboard;
