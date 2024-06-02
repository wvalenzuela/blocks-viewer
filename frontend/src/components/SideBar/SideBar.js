import {drawerWidth} from '../utils';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MuiDrawer from '@mui/material/Drawer';
import Container from "@mui/material/Container";
import {ViewerContainer} from "../index";
import * as React from "react";
import { useNavigate} from "react-router-dom";

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        }),
    },
}));
const SideBar = ({open, toggleDrawer}) => {
    const navigate = useNavigate();
    return (
        <Drawer variant='permanent' open={open}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
            >
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon/>
                </IconButton>
            </Toolbar>
            <Divider/>
            <List component='nav'>
                <ListItemButton onClick={() => navigate('/viewer')}>
                    <ListItemIcon>
                        <ViewModuleIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Viewer' />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/create-Block')}>
                    <ListItemIcon>
                        <ViewInArIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Creat Blocks'/>
                </ListItemButton>
            </List>
        </Drawer>
    );
};
export default SideBar;
