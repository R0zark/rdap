import ControlPointIcon from '@mui/icons-material/ControlPoint';
import LogoutIcon from '@mui/icons-material/Logout';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import RModal from '../components/RModal';
import theme from '../lib/theme';


const drawerWidth = 240;

export default function Main() {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [errorModal, setErrorModal] = useState('');
    const [title, setTitle] = useState('Bienvenido');
    const connectionItem = JSON.parse(router.query.connectionItem)


    return (
        <React.Fragment>
            <Head>
                <title>Rdap - LDAP Administration</title>
            </Head>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            {title + " " + connectionItem.user}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Toolbar onClick={() => router.push({ pathname: '/main', query: { 'connectionItem': JSON.stringify(connectionItem) } })} style={{ backgroundColor: theme.palette.primary.main }}><Typography variant='h3' color={'white'}>RDAP</Typography></Toolbar>
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => router.push({ pathname: '/newObject', query: { 'connectionItem': JSON.stringify(connectionItem) } })}>
                                <ListItemIcon>
                                    <ControlPointIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={'Nuevo Objeto'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => router.push({ pathname: '/search', query: { 'connectionItem': JSON.stringify(connectionItem) } })}>
                                <ListItemIcon>
                                    <SearchIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={'Busqueda'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => router.push({ pathname: '/advancedSearch', query: { 'connectionItem': JSON.stringify(connectionItem) } })} >
                                <ListItemIcon>
                                    <SavedSearchIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={'Busqueda avanzada'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => router.push({ pathname: '/home' })} >
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={'Desconectar'} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
                >
                    <Toolbar />
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                        enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                        imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                        Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                        Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                        adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                        nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                        leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                        feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                        consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                        sapien faucibus et molestie ac.
                    </Typography>
                    <Typography paragraph>
                        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                        eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                        neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                        tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                        sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                        tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                        gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                        et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                        tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                        eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                        posuere sollicitudin aliquam ultrices sagittis orci a.
                    </Typography>
                </Box>
            </Box>
            {openModal &&
                <RModal openModal={openModal} closeModal={() => setOpenModal(false)} title="Error" body={errorModal}></RModal>
            }

        </React.Fragment>
    );
};
