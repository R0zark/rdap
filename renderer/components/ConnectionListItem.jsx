import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
export default function ConnectionListItem({name,user,dc,url,port, handleConnection, handleDelete}) {
    const sendConnection = () =>{
        handleConnection({name,port,url,user,dc})
    }
    const sendDelete = () =>{
        handleDelete({name,user,dc})
    }
    return (
        <>
            <ListItemButton>
                <ListItemText  onClick={sendConnection} primary={name} secondary={user + " : " +dc} /> <DeleteIcon onClick={sendDelete} color='primary'/>
            </ListItemButton>
        </>
    )
}