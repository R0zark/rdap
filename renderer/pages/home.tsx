import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CredentialService from '../../main/services/credentialService';
import LdapService from '../../main/services/ldapService';
import ConnectionListItem from '../components/ConnectionListItem';
import NewConnectionForm from '../components/NewConnectionForm';
import RModal from '../components/RModal';

export default function Home() {
    let _ldapService = null
    const _credentialService = new CredentialService()
    const [connectionList, setConnectionList] = useState([])
    const [newConnectionModal, setNewConnectionModal] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [errorModal, setErrorModal] = useState('')
    const router = useRouter()

    useEffect(() => {
        setConnectionList(_credentialService.loadCredentials())
    }, [])

    const connect = async (conDetails) => {
        let connectionItem = connectionList.find(c => c.name == conDetails.name)
        let user = {
            user: connectionItem.user,
            password: connectionItem.password
        }
        try {
            _ldapService = new LdapService("ldap://" + connectionItem.url + ":" + connectionItem.port, connectionItem.dc)
            await _ldapService.login(user, connectionItem.dc)
            router.push({ pathname: '/main', query:{'connectionItem': JSON.stringify(connectionItem)} })
        }
        catch (e) {
            setOpenModal(true)
            setErrorModal(e.message)
        }
    }
    const saveConnection = (conDetails) => {
        console.log(conDetails)
        let newConnectionList = connectionList
        if (!connectionList.find(c => c.name == conDetails.name)) {
            newConnectionList.push(conDetails)
            setConnectionList(newConnectionList)
            _credentialService.saveCredentials(newConnectionList)
            setNewConnectionModal(false)
        }
        else {
            setOpenModal(true)
        }

    }
    const deleteConnection = (conDetails) => {
        console.log(conDetails)
        console.log(connectionList)
        let newConnectionList = connectionList.filter(con => con.name != conDetails.name)
        console.log(newConnectionList)
        setConnectionList(newConnectionList)
        _credentialService.saveCredentials(newConnectionList)
    }

    return (
        <React.Fragment>
            <Head>
                <title>Rdap - LDAP Administration</title>
            </Head>
            <>
                <Typography variant='h2' margin="1em" color='primary' textAlign='center'>RDAP</Typography>
                {
                    !newConnectionModal && <Grid container padding={5}>
                        <Grid item xs={12} padding={1} borderRadius="8px" display="flex" justifyContent="center" alignItems="center">
                            <Typography variant='h5' paddingRight={1}>Conexiones Historicas</Typography>
                            <Fab aria-label="add" size='small' color="primary" onClick={() => setNewConnectionModal(true)}  > <AddIcon /></Fab>
                        </Grid>
                        <Grid borderTop={1} item pt={1} xs={12} sm={12} lg={12} display="flex" justifyContent="center" alignItems="center" >
                            <List style={{ width: "24em", background: '', borderRadius: 10 }}>
                                {
                                    connectionList.map((con, index) => {
                                        return (
                                            <ListItem key={index}>
                                                <ConnectionListItem name={con.name} url={con.url} port={con.port} user={con.user} dc={con.dc} handleConnection={connect} handleDelete={deleteConnection} />
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </Grid>
                    </Grid>

                }
                {newConnectionModal &&
                    <NewConnectionForm handleSave={saveConnection} handleCloseForm={() => setNewConnectionModal(false)}></NewConnectionForm>
                }
                {openModal &&
                    <RModal openModal={openModal} closeModal={() => setOpenModal(false)} title="Error" body={errorModal}></RModal>
                }
            </>
        </React.Fragment>
    );
};
