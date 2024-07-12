import List, { Box, Modal } from '@mui/material';
import Typography from '@mui/material/Typography';
export default function InfoModal({ openModal, closeModal, entry }) {
    const infoObject = []

    const getAttributesFromEntry = (item) => {
        let attributesFromEntry = []
        let componentsFromEntry = []
        let type = null;
        let value = '';
        componentsFromEntry.push(<Typography key={1000}>Nombre completo : {item.pojo.objectName}</Typography>)
        item.json.attributes.forEach(attribute => {
            type = attribute.type
            attribute.values.forEach((v, index) => {
                ++index
                return index < attribute.values.length ? value += v + ', ' : value += v
            })
            attributesFromEntry.push({ type, value })
            value = ''
        })
        attributesFromEntry.map((attribute, index) => {
            componentsFromEntry.push(<Typography key={index}>{attribute.type} : {attribute.value}</Typography>)
        })
        return (componentsFromEntry)
    }


    return (
        <>
            <Modal
                open={openModal}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    borderRadius: 2,
                    color: 'black',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    height: '70%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h6" textAlign={'center'} style={{ fontWeight: 'bolder' }} component="h1">
                        Descripción del objeto
                    </Typography>
                    <Box textAlign={'center'} style={{ marginTop: '2rem' }}>
                        {
                            getAttributesFromEntry(entry)
                        }
                    </Box>

                </Box>
            </Modal>
        </>
    )
}