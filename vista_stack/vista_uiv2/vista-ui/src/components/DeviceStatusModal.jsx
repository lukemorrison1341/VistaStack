import React, { useEffect, useState,useNavigate } from "react";
import { Modal, Box, Typography, CircularProgress, Button } from "@mui/material";
import { checkDeviceStatus, checkFrontendStatus} from "../services/api";

export default function DeviceStatusModal({ username, setDeviceConnected, setFrontendConnect, setBackendConnect}) {
  const [open, setOpen] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [loading, setLoading] = useState(true);

   
  useEffect(() => {
    let isMounted = true; // ✅ Prevents state updates on unmounted components
  
    const fetchStatuses = async () => {
      console.log("Checking device and frontend status...");
  
      const backendStatus = await checkDeviceStatus(username);
      const frontendStatus = await checkFrontendStatus();
  
      if (isMounted) {
        setDeviceStatus(backendStatus);
        setDeviceConnected(backendStatus === "online");
        setBackendConnect(backendStatus === "online");
        setFrontendConnect(frontendStatus.status === "success");
        setLoading(false);
      }
    };
  
    // ✅ Run Immediately
    fetchStatuses();
  
    // ✅ Set Up Interval to Run Every 30 Seconds
    const interval = setInterval(fetchStatuses, 30000);
  
    // ✅ Cleanup function to prevent memory leaks & stop running interval on unmount
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [username]); // ✅ Only run when `username` changes
  
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
        {loading ? (
          <>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Checking device connectivity...
            </Typography>
          </>
        ) : deviceStatus === "online" ? (
          <>
            <Typography variant="h6" sx={{ color: "green" }}>
              Device is online!
            </Typography>
            <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>
              Continue
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ color: "red" }}>
              Device is offline!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Please check your VISTA device and try again.
            </Typography>
            <Button variant="contained" onClick={() => {
              const navigator = useNavigate();
              navigator.navigate("/dashboard");

            }} sx={{ mt: 2 }}>
              Retry
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}
