
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Container, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import theme from '../lib/theme';
import InfoModal from './InfoModal';
export default function ResultTable({ resultQuery, sendDelete, sendModifyObject }) {

    const [resultList, setResultList] = useState(resultQuery);
    const [infoModal, setInfoModal] = useState(false);
    const [currentObject, setCurrentObject] = useState(null);

    const getObjectType = (object) => {
        let typeObject = null;
        object.attributes.forEach((attribute) => {

            if (attribute.type == "objectClass") typeObject = attribute.values[0];
        })
        if (typeObject == "organizationalUnit") return "Unidad Organizativa";
        if (typeObject.includes("inetOrgPerson")) return "Usuario";
        if (typeObject == "groupOfNames") return "Grupo";
        if (typeObject == "dc") return "Organizacion";
    }
    const getObjectName = (object) => {
        let resObject = object.split(",")
        let finalObject = resObject[0].split("=")[1];
        return finalObject;
    }

    const handleModifyObject = (object) => {
        sendModifyObject(object);
    }

    const openDetails = (object) => {
        setCurrentObject(object);
        setInfoModal(true);
    }
    const closeDetails = () => {
        setCurrentObject(null);
        setInfoModal(false);
    }

    useEffect(() => {
        setResultList(resultQuery);
    }, [resultQuery])

    return (


        <Box xl={12} md={12} lg={12} style={{ marginTop: '3rem', height: '30rem' }}>
            <Container maxWidth="xl" style={{ padding: '0' }}>
                <Paper elevation={3}>
                    <List style={{ padding: '0' }}>
                        <ListItem style={{ paddingTop: 16, paddingLeft: 8, paddingBottom: 16, paddingRight: 8, backgroundColor: theme.palette.primary.light, borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                            <Grid container>
                                <Grid item xs={4} md={4} lg={4}>
                                    <ListItemText style={{ color: 'white', fontWeight: 'bolder', paddingLeft: '1rem' }} primary='Nombre' />
                                </Grid>
                                <Grid item xs={4} md={4} lg={4}>
                                    <ListItemText style={{ color: 'white', fontWeight: 'bolder', paddingLeft: '1rem' }} primary='Objeto' />
                                </Grid>
                                <Grid item xs={4} md={4} lg={4}>
                                    <ListItemText style={{ color: 'white', fontWeight: 'bolder', paddingLeft: '1rem' }} primary='Acciones' />
                                </Grid>
                            </Grid>
                        </ListItem>
                        <Divider />
                        {
                            resultList.map((item, index) => {
                                if (getObjectType(item)) {
                                    return (
                                        <ListItem key={index} disablePadding>
                                            <ListItemButton>
                                                <Grid container>
                                                    <Grid onClick={() => openDetails(item)} item xs={4} md={4} lg={4}>
                                                        <ListItemText style={{ paddingLeft: '1rem', color: theme.palette.primary.main, textDecoration: 'underline' }} primary={getObjectName(item.json.objectName)} />
                                                    </Grid>
                                                    <Grid item xs={4} md={4} lg={4}>
                                                        <ListItemText style={{}} primary={getObjectType(item)} />
                                                    </Grid>
                                                    <Grid item xs={4} md={4} lg={4}>
                                                        <EditIcon sx={{ width: '2rem', marginRight: '1rem' }} color='primary' onClick={() => handleModifyObject(item)} />
                                                        <DeleteIcon sx={{ width: '2rem' }} color='primary' onClick={() => sendDelete(item)} />
                                                    </Grid>
                                                </Grid>
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                }
                            })
                        }
                        {
                            infoModal && <InfoModal openModal={infoModal} closeModal={() => closeDetails()} entry={currentObject} />
                        }
                    </List>
                </Paper>
            </Container>
        </Box>)
}