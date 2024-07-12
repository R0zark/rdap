import { useState } from 'react';
import { Stack, TextField, Box } from '@mui/material';
import Button from '@mui/material/Button';
import LdapService from '../../main/services/ldapService';
import RModal from './RModal';

export default function NewConnectionForm({ handleSave, handleCloseForm }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('');
  const [user, setUser] = useState('');
  const [port, setPort] = useState('');
  const [dc, setDC] = useState('');
  const [password, setPassword] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');

  const handleName = (event) => setName(event.target.value)
  const handleUser = (event) => setUser(event.target.value)
  const handleUrl = (event) => setUrl(event.target.value)
  const handlePort = (event) => setPort(event.target.value)
  const handleDC = (event) => setDC(event.target.value)
  const handlePassword = (event) => setPassword(event.target.value)

  const sendSave = () => {
    handleSave({ name, url, user, port, dc, password })
  }
  const sendCloseForm = () => {
    handleCloseForm()
  }

  const testConnection = async () => {

    let credential = {
      user: user,
      password: password
    }
    try {
      const _ldapService = new LdapService("ldap://" + url + ":" + port, dc)
      await _ldapService.login(credential, dc)
    }
    catch (error) {
      setOpenModal(true)
      setError(error.message)
    }
  }

  return (
    <>
      <Stack spacing={2} sm={6} xm={6} lg={6} justifyContent="center" alignItems="center">
        <TextField label="Nombre Conexion" required value={name} variant='filled' onChange={handleName} />
        <TextField label="URL" value={url} required variant='filled' onChange={handleUrl} />
        <TextField label="Port" value={port} required variant='filled' onChange={handlePort} />
        <TextField label="DC" value={dc} required variant='filled' onChange={handleDC} />
        <TextField label="Usuario" value={user} required variant='filled' onChange={handleUser} />
        <TextField label="Contraseña" type='password' required value={password} variant='filled' onChange={handlePassword} />
        <Box>
          <Button variant="contained" style={{ margin: 4 }} color="primary" onClick={sendSave}>Guardar</Button>
          <Button variant="contained" style={{ margin: 4 }} color="secondary" onClick={sendCloseForm}>Cancelar</Button>
          <Button variant="contained" style={{ margin: 4 }} color="secondary" onClick={testConnection}>Probar Conexión</Button>
        </Box>
      </Stack>
      {
        openModal && (
          <RModal openModal={openModal} closeModal={() => setOpenModal(false)} title="Error" body={error}></RModal>

        )
      }
    </>
  )
}