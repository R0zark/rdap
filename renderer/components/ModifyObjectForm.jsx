import { useState } from 'react';
import { Stack, TextField, Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import RModal from './RModal';
import Alert from '@mui/material/Alert';
import TYPE_OBJECT from '../../main/constants/typeobject';
export default function ModifyObjectForm({ typeofObject, objectToModify, newObject, success }) {

  const [openModal, setOpenModal] = useState(false);
  const [typeObject, setTypeObject] = useState(typeofObject);
  const [nameObject, setNameObject] = useState('');
  const [parentObject, setParentObject] = useState('');
  const [surnameObject, setSurnameObject] = useState('');
  const [homeDirectoryObject, setHomeDirectoryObject] = useState('');
  const [gidNumberObject, setGidNumberObject] = useState('');
  const [uidNumber, setUidNumber] = useState('');
  const [password, setPassword] = useState('');
  const [members, setMembers] = useState([]);

  const handleNameChange = (event) => setNameObject(event.target.value)
  const handleParentChange = (event) => setParentObject(event.target.value)
  const handleSurnameChange = (event) => setSurnameObject(event.target.value)
  const handleHomeDirectoryChange = (event) => setHomeDirectoryObject(event.target.value)
  const handleGidNumberChange = (event) => setGidNumberObject(event.target.value)
  const handleUidNumberChange = (event) => setUidNumber(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)
  const handleMembersChange = (event) => {
    setMembers(event.target.value)
  }

  useEffect(() => {
    setTypeObject(typeofObject)
    setFormFields()
    if (success) handleSuccess()
  }, [typeofObject, success])

  const setFormFields = () => {
    let oldObject = objectToModify
    setParentObject(getParentObject(oldObject))
    oldObject.attributes.forEach(element => {
      if (element.type == 'ou' || element.type == 'cn') setNameObject(element.values[0])
      if (element.type == 'member') setMembers(getMembers(oldObject))
      if (element.type == 'sn') setSurnameObject(element.values[0])
      if (element.type == 'uidNumber') setUidNumber(element.values[0])
      if (element.type == 'gidNumber') setGidNumberObject(element.values[0])
      if (element.type == 'homeDirectory') setHomeDirectoryObject(element.values[0])
      if (element.type == 'userPassword') setPassword(element.values[0])
    })
  }

  const getMembers = (object) => {
    let stringMembers = ''
    let parent = object.attributes.find(element => element.type == 'member')
    parent.values.forEach((element, index) => {
      if (index < parent.values.length - 1) {
        stringMembers += element + '|'
      }
      else {
        stringMembers += element
      }

    })
    return stringMembers
  }

  const getParentObject = (object) => {
    let stringReturn = ''
    let parent = object.objectName.split(",").slice(1)
    parent.forEach((element, index) => {
      if (index < parent.length - 1) {
        stringReturn += element + ','
      }
      else {
        stringReturn += element
      }

    })
    return stringReturn
  }

  const handleSuccess = () => {
    setNameObject('')
    setParentObject('')
    setGidNumberObject('')
    setSurnameObject('')
    setHomeDirectoryObject('')
    setUidNumber('')
    setPassword('')
    setMembers([])

  }

  const handleNewObject = () => {
    let newObjectStructure = {}
    newObjectStructure.operation = 'replace'
    if (typeObject == TYPE_OBJECT.OU) {
      if (parentObject != null) newObjectStructure.dn = parentObject;
      newObjectStructure.modification = {
        "objectClass": "organizationalUnit",
        "ou": nameObject
      }
    }

    if (typeObject == TYPE_OBJECT.USER) {
      if (parentObject != null) newObjectStructure.dn = parentObject;
      newObjectStructure.modification = {
        "cn": nameObject,
        "sn": surnameObject,
        "uid": nameObject,
        "homeDirectory": homeDirectoryObject,
        "gidNumber": gidNumberObject,
        "uidNumber": uidNumber,
        "userPassword": password,
        "objectClass": ['inetOrgPerson', 'shadowAccount', 'posixAccount']
      }
    }
    if (typeObject == TYPE_OBJECT.GROUP) {
      if (parentObject != null) newObjectStructure.dn = parentObject;
      if (members.length > 0) {
        newObjectStructure.modification = {
          "cn": nameObject,
          "member": members,
          "objectClass": ['groupOfNames']
        }
      }
      else {
        newObjectStructure.modification = {
          "cn": nameObject,
          "objectClass": ['top', 'groupOfNames']
        }
      }
    }
    newObject(newObjectStructure);
  }

  return (
    <>
      {
        typeObject == TYPE_OBJECT.OU &&
        <Stack spacing={2} sm={6} xm={6} lg={6} marginTop={'1rem'} justifyContent="center" alignItems="center">
          <TextField label="Objeto padre" value={parentObject} onChange={handleParentChange} variant='filled' />
          <TextField label="Nombre" value={nameObject} onChange={handleNameChange} required variant='filled' />

          <Box>
            <Button variant="contained" style={{ margin: 4 }} onClick={handleNewObject} color="primary" >Guardar</Button>
          </Box>
        </Stack>

      }
      {
        typeObject == TYPE_OBJECT.USER &&
        <Stack spacing={2} sm={6} xm={6} lg={6} marginTop={'1rem'} justifyContent="center" alignItems="center">
          <TextField label="Objeto padre" value={parentObject} onChange={handleParentChange} variant='filled' />
          <TextField label="Nombre" required variant='filled' value={nameObject} onChange={handleNameChange} />
          <TextField label="Apellidos" required variant='filled' value={surnameObject} onChange={handleSurnameChange} />
          <TextField label="Directorio" required variant='filled' value={homeDirectoryObject} onChange={handleHomeDirectoryChange} />
          <TextField label="gidNumber" required variant='filled' value={gidNumberObject} onChange={handleGidNumberChange} />
          <TextField label="uidNumber" required variant='filled' value={uidNumber} onChange={handleUidNumberChange} />
          <TextField label="Contraseña" type='password' required variant='filled' value={password} onChange={handlePasswordChange} />
          <Box>
            <Button variant="contained" style={{ margin: 4 }} color="primary" onClick={handleNewObject} >Guardar</Button>
          </Box>
        </Stack>

      }
      {
        typeObject == TYPE_OBJECT.GROUP &&
        <Stack spacing={2} sm={6} xm={6} lg={6} marginTop={'1rem'} justifyContent="center" alignItems="center">
          <TextField label="Objeto padre" value={parentObject} onChange={handleParentChange} variant='filled' />
          <TextField label="Nombre" required variant='filled' value={nameObject} onChange={handleNameChange} />

          <Alert severity="info">Introducir usuarios con nombre completo separado por "|" Ejemplo cn=usuario,dc=vet,dc=org | cn=usuario2,dc=vet,dc=org</Alert>
          <TextField label="Miembros" fullWidth multiline rows={4} value={members} variant='filled' onChange={handleMembersChange} />

          <Box>
            <Button variant="contained" style={{ margin: 4 }} color="primary" onClick={handleNewObject} >Guardar</Button>
          </Box>
        </Stack>
      }
      {
        openModal && (
          <RModal openModal={openModal} closeModal={() => setOpenModal(false)} title="Error" body={error}></RModal>
        )
      }
    </>
  )
}