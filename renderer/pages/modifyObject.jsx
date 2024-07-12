import ControlPointIcon from '@mui/icons-material/ControlPoint';
import LogoutIcon from '@mui/icons-material/Logout';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, TextField, ListItemText, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import RModal from '../components/RModal';
import TYPE_OBJECT from '../../main/constants/typeobject';
import theme from '../lib/theme';
import ModifyObjectForm from '../components/ModifyObjectForm';
import LdapService from '../../main/services/ldapService';
const drawerWidth = 240;

export default function ModifySearch() {
    let _ldapService = null;
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [errorModal, setErrorModal] = useState('');
    const [title, setTitle] = useState('Modificacion del objeto');
    const data = JSON.parse(router.query.data);
    const [typeObject, setTypeObject] = useState(0);
    const [successModal, setSuccessModal] = useState(false);
    const [message, setMessage] = useState('')
    useEffect(() => {
        getObjectType(data.item)
    }, [])

    const handleNewObject = async (object) => {
        try {
            loadConnection()
            let result = await _ldapService.updateRecord(data.item.objectName,object,typeObject);
            setSuccessModal(true)
            setMessage(result)
        } catch (error) {
            setOpenModal(true)
            setErrorModal(error.message)

        }

    }

    const getObjectType = (object) => {
        let typeObject = null;
        object.attributes.forEach((attribute) => {

            if (attribute.type == "objectClass") typeObject = attribute.values[0];
        })
        if (typeObject == "organizationalUnit") setTypeObject(TYPE_OBJECT.OU);
        if (typeObject.includes("inetOrgPerson")) setTypeObject(TYPE_OBJECT.USER);
        if (typeObject == "groupOfNames") setTypeObject(TYPE_OBJECT.GROUP);
    }

    const loadConnection = async () => {
        let user = {
            user: data.connectionItem.user,
            password: data.connectionItem.password
        }
        _ldapService = new LdapService("ldap://" + data.connectionItem.url + ":" + data.connectionItem.port, data.connectionItem.dc)
        await _ldapService.login(user, data.connectionItem.dc)
    }

    const closeSuccessModal = () => {
        setSuccessModal(false)
        router.push({ pathname: '/search', query: { 'connectionItem': JSON.stringify(data.connectionItem) } })

    }

    return (
        <React.Fragment>
            <Head>
                <title>Rdap - LDAP Administration conectado como : {data.connectionItem.user}</title>
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
                    <Toolbar onClick={() => router.push({ pathname: '/main', query: { 'connectionItem': JSON.stringify(data.connectionItem) } })} style={{ backgroundColor: theme.palette.primary.main }}><Typography variant='h3' color={'white'} >RDAP</Typography></Toolbar>
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => router.push({ pathname: '/newObject', query: { 'connectionItem': JSON.stringify(data.connectionItem) } })}>
                                <ListItemIcon>
                                    <ControlPointIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={'Nuevo Objeto'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => router.push({ pathname: '/search', query: { 'connectionItem': JSON.stringify(data.connectionItem) } })}>
                                <ListItemIcon>
                                    <SearchIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={'Busqueda'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => router.push({ pathname: '/advancedSearch', query: { 'connectionItem': JSON.stringify(data.connectionItem) } })} >
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
                    <ModifyObjectForm typeofObject={typeObject} objectToModify={data.item} newObject={handleNewObject} />
                </Box>
            </Box>
            {openModal &&
                <RModal openModal={openModal} closeModal={() => setOpenModal(false)} title="Error" body={errorModal}></RModal>
            }
            {successModal &&
                <RModal openModal={successModal} closeModal={() => closeSuccessModal()} title="Éxito" body={message}></RModal>
            }

        </React.Fragment>
    );
};
