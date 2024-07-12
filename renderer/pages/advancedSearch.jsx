import ControlPointIcon from '@mui/icons-material/ControlPoint';
import LogoutIcon from '@mui/icons-material/Logout';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Toolbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import LdapService from '../../main/services/ldapService';
import RModal from '../components/RModal';
import ResultTable from '../components/ResultTable';
import theme from '../lib/theme';
const drawerWidth = 240;

export default function AdvancedSearch() {
    let _ldapService = null
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [errorModal, setErrorModal] = useState('');
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [title, setTitle] = useState('Búsqueda Avanzada');
    const connectionItem = JSON.parse(router.query.connectionItem)
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleQuery = (e) => setQuery(e.target.value);

    async function handleSearch() {
        try {
            console.log(query)
            loadConnection()
            let criteria = {
                'filter': query,
                'scope': 'sub'
            }
            let res = await _ldapService.searchCurrentDN(criteria)
            console.log(res)
            setResults(res)
        } catch (error) {
            setOpenModal(true)
            setErrorModal(error)
        }
    }


    const handleModifyObject = (record) => {
        console.log(record)
        let data = {
            'connectionItem': connectionItem,
            'item': record.pojo
        }
        router.push({
            pathname: '/modifyObject', query:{'data': JSON.stringify(data)}
        })
    }


    const deleteRecord = async (currentObject) => {
        try {
            loadConnection()
            await _ldapService.deleteRecord(currentObject.pojo.objectName);
            let listFiltered = results.filter(i => i.pojo.objectName != currentObject.pojo.objectName)
            setResults(listFiltered)
            setDeleteDialog(false);

        } catch (error) {
            setDeleteDialog(false);
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
                                <ListItemText primary={'Búsqueda'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => router.push({ pathname: '/advancedSearch', query: { 'connectionItem': JSON.stringify(connectionItem) } })} >
                                <ListItemIcon>
                                    <SavedSearchIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={'Búsqueda avanzada'} />
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
                    <Alert severity="info" >Para conocer como hacer consultas revisar este artículo <a target='_blank' href="https://www.rfc-editor.org/rfc/rfc2254">RFC</a></Alert>
                    <Container style={{ marginTop: '1rem' }}>
                        <Grid container>
                            <Grid item xs={10} md={11} lg={11}>
                                <TextField
                                    id="filled-multiline-static"
                                    label="Consulta"
                                    multiline
                                    value={query}
                                    onChange={handleQuery}
                                    fullWidth={true}
                                    rows={4}
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={2} md={1} lg={1}>
                                <Button variant="contained" fullWidth style={{ margin: 4 }} color="primary" onClick={() => handleSearch()} >Buscar</Button>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                {
                                    results && results.length > 0 && <ResultTable resultQuery={results} sendDelete={deleteRecord} sendModifyObject={handleModifyObject} />
                                }
                            </Grid>
                        </Grid>

                    </Container>
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
