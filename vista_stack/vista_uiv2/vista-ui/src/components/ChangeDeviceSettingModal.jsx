import React, { useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"
import { Modal, Box, Typography, Button } from "@mui/material";

export default function ChangeDeviceSettingModal({ open, handleClose, frontendConnect, backendConnect }) {
    const [reset, setReset] = useState(false);
    const [changeWiFi, setChangeWiFi] = useState(false);
    return (
        <>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography id="modal-title" variant="h6">Change Device Settings</Typography>

                    <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>
                        Change WiFi Password
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setReset(true)}
                        sx={{ mt: 2, ml: 2 }}
                    >
                        Reset Device
                    </Button>
                </Box>
            </Modal>

            
            <MakeSureModal open={reset} handleClose={() => setReset(false)} />
        </>
    );
}


function MakeSureModal({ open, handleClose }) {

    const navigate = useNavigate();
    const [resetDevice, setResetDevice] = useState(false);

    useEffect(() => {
        if(resetDevice){
            
            navigate("/");
        }

    },[resetDevice, navigate])

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="confirm-title" aria-describedby="confirm-description">
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 300,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                }}
            >
                <Typography id="confirm-title" variant="h6">Are you sure?</Typography>
                <Typography id="confirm-description" sx={{ mt: 1, mb: 2 }}>
                    This action cannot be undone.
                </Typography>

                <Button variant="contained" color="error" onClick={() => { //EDIT THIS TO ACTUALLY RESET DEVICE
                    setResetDevice(true);


                }} sx={{ mr: 2 }}>
                    Yes, Reset
                </Button>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
}

function ChangeWiFiModal({open, handleClose}) {
    
}
