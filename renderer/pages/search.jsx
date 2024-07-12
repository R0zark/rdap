import ControlPointIcon from '@mui/icons-material/ControlPoint';
import LogoutIcon from '@mui/icons-material/Logout';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import SCOPE from '../../main/constants/scope';
import TYPE_OBJECT from '../../main/constants/typeobject';
import LdapService from '../../main/services/ldapService';
import RModal from '../components/RModal';
import SearchForm from '../components/SearchForm';
import theme from '../lib/theme';
const drawerWidth = 240;

export default function Search() {
    let _ldapService = null;
    const router = useRouter();
    const [currentObject, setCurrentObject] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [errorModal, setErrorModal] = useState('');
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [title, setTitle] = useState('Busqueda');
    const connectionItem = JSON.parse(router.query.connectionItem)
    const [resultSearch, setResultSearch] = useState([]);


    const handleQuerySearch = (query) => {
        let scope = null
        let typeObject = null
        let queryCriteria = {}
        let criteriaString = ''
        if (query.scope == SCOPE.BASE) scope = 'base'
        if (query.scope == SCOPE.ONE) scope = 'one'
        if (query.scope == SCOPE.SUB) scope = 'sub'

        if (query.typeObject == TYPE_OBJECT.ALL) typeObject = 'objectClass=*'
        if (query.typeObject == TYPE_OBJECT.OU) typeObject = 'objectClass=organizationalUnit'
        if (query.typeObject == TYPE_OBJECT.GROUP) typeObject = 'objectClass=groupOfNames'
        if (query.typeObject == TYPE_OBJECT.USER) typeObject = 'objectClass=inetOrgPerson'
        queryCriteria.scope = scope
        if (query.name == '') criteriaString = `(${typeObject})`
        if (query.name != '') criteriaString = `(&(${typeObject})(|(cn=*${query.name}*)(ou=*${query.name}*))`
        queryCriteria.filter = criteriaString
        querySearch(queryCriteria);

    }

    const querySearch = async (querySearch) => {

        try {
            loadConnection()
            let result = await _ldapService.searchCurrentDN(querySearch)
            setResultSearch(result)
        }
        catch (e) {
            setOpenModal(true)
            setErrorModal(e.message)
        }
    }

    const deleteRecord = async () => {
        try {
            loadConnection()
            await _ldapService.deleteRecord(currentObject.pojo.objectName);
            let listFiltered = resultSearch.filter(i => i.pojo.objectName != currentObject.pojo.objectName)
            setResultSearch(listFiltered)
            setDeleteDialog(false);

        } catch (error) {
            setDeleteDialog(false);
            setOpenModal(true)
            setErrorModal(error.message)

        }
    }

    const handleDelete = (record) => {
        setCurrentObject(record)
        setDeleteDialog(true)
    }

    const handleModifyObject = (record) => {
        let data = {
            'connectionItem': connectionItem,
            'item': record
        }
        router.push({
            pathname: '/modifyObject', query:{'data': JSON.stringify(data)}
        })
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
                    <Toolbar onClick={() => router.push({ pathname: '/main', query: { 'connectionItem': JSON.stringify(connectionItem) } })} style={{ backgroundColor: theme.palette.primary.main }}><Typography variant='h3' color={'white'} >RDAP</Typography></Toolbar>                    <Divider />
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
                    <SearchForm resultSearch={resultSearch} querySearch={handleQuerySearch} sendDelete={handleDelete} sendModify={handleModifyObject} />
                </Box>
            </Box>
            {openModal &&
                <RModal openModal={openModal} closeModal={() => setOpenModal(false)} title="Error" body={errorModal}></RModal>
            }
            {deleteDialog &&
                <Dialog
                    open={deleteDialog}
                    onClose={() => setOpenDelete(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Accion: Eliminar"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Estas seguro que deseas eliminar este objeto: {currentObject.pojo.objectName.split(",")[0]}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialog(false)} autoFocus>Cancelar</Button>
                        <Button onClick={() => deleteRecord()}>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </React.Fragment>
    );
};
