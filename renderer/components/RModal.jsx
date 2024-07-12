import { Box, Modal } from '@mui/material';
import Typography from '@mui/material/Typography';
export default function RModal({ openModal, closeModal, title, body }) {

    return (
        <>
            {title == "Error" &&
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
                        color: '#fff',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'error.light',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography id="modal-modal-title" variant="h6" style={{ fontWeight: 'bolder' }} component="h2">
                            {title}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {body}
                        </Typography>
                    </Box>
                </Modal>
            }

            { title == "Éxito" &&
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
                    color: '#fff',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'success.light',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h6" style={{ fontWeight: 'bolder' }} component="h2">
                        {title}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {body}
                    </Typography>
                </Box>
            </Modal>
            }
            
        </>
    )
}