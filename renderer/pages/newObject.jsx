import ControlPointIcon from '@mui/icons-material/ControlPoint';
import LogoutIcon from '@mui/icons-material/Logout';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import TYPE_OBJECT from '../../main/constants/typeobject';
import RModal from '../components/RModal';
import NewObjectForm from '../components/NewObjectForm';
import theme from '../lib/theme';
import LdapService from '../../main/services/ldapService';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const drawerWidth = 240;

export default function NewObject() {
    let _ldapService = null;
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [errorModal, setErrorModal] = useState('');
    const [success, setSuccess] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState('');
    const [title, setTitle] = useState('Nuevo Objeto');
    const connectionItem = JSON.parse(router.query.connectionItem)
    const [objectTab, setObjectTab] = useState(1);

    const closeSuccess = () => {
        setSuccess(false);


    }

    const handleObjectTab = (event) => {
        setObjectTab(event.target.value)
    }

    const addNewObject = async (newEntry) => {
        let object = newEntry
        try {
            loadConnection()
            let result = await _ldapService.addNewObject(object)
            setSuccess(true);
            setMessageSuccess(result)

        } catch (error) {
            setOpenModal(true)
            setErrorModal(error.message)

        }

    }

    const loadConnection = async () => {
        let user = {
            user: connectionItem.user,
            password: connectionItem.password
        }
        _ldapService = new LdapService("ldap://" + connectionItem.url + ":" + connectionItem.port, connectionItem.dc)
        await _ldapService.login(user, connectionItem.dc)
    }
    return (
        <React.Fragment>
            <Head>
                <title>Rdap - LDAP Administration conectado como : {connectionItem.user}</title>
            </Head>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            {title}
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
                    anchor="left">
                    <Toolbar onClick={() => router.push({ pathname: '/main', query: { 'connectionItem': JSON.stringify(connectionItem) } })} style={{ backgroundColor: theme.palette.primary.main }}><Typography variant='h3' color={'white'} >RDAP</Typography></Toolbar>
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
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo de objeto</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                variant='filled'
                                value={objectTab}
                                label="Objeto"
                                onChange={handleObjectTab}
                            >
                                <MenuItem value={TYPE_OBJECT.OU}>Unidad Organizativa</MenuItem>
                                <MenuItem value={TYPE_OBJECT.USER}>Usuario</MenuItem>
                                <MenuItem value={TYPE_OBJECT.GROUP}>Grupo</MenuItem>
                            </Select>
                        </FormControl>
                        {objectTab && objectTab != TYPE_OBJECT.ALL &&
                            <NewObjectForm typeofObject={objectTab} newObject={addNewObject} success={success}/>
                        }
                    </Container>

                </Box>
            </Box>
            {openModal &&
                <RModal openModal={openModal} closeModal={() => setOpenModal(false)} title="Error" body={errorModal}></RModal>
            }
            {success &&
                <RModal openModal={success} closeModal={() => closeSuccess()} title="Éxito" body={messageSuccess}></RModal>
            }

        </React.Fragment>
    );
};
