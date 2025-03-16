import React, { useContext, useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { ConnectionContext } from "../components/ConnectionContext";
import ChangeDeviceSettingModal from "../components/ChangeDeviceSettingModal";

export default function UserSettings() {
  const { frontendConnect, backendConnect } = useContext(ConnectionContext);

  // ✅ Ensure these states are Booleans
  const [resetPassword, setResetPassword] = useState(false);
  const [changeDeviceSettings, setChangeDeviceSettings] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3, alignItems: "center" }}>
      {/* User Information Card */}
      <Card sx={{ width: 400, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h6">👤 User Information</Typography>
          <Typography variant="body1">Username: {localStorage.getItem("username")}</Typography>
          <Typography variant="body1">Device Name: {localStorage.getItem("deviceName")}</Typography>
        </CardContent>
      </Card>

      {/* Connectivity Status Card */}
      <Card sx={{ width: 400, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h6">📡 Connectivity Status</Typography>
          <Typography variant="body1" color={frontendConnect ? "success.main" : "error.main"}>
            Frontend Connection: {frontendConnect ? "Connected ✅" : "Disconnected ❌"}
          </Typography>
          <Typography variant="body1" color={backendConnect ? "success.main" : "error.main"}>
            Backend Connection: {backendConnect ? "Connected ✅" : "Disconnected ❌"}
          </Typography>
        </CardContent>
      </Card>

      {/* Last Seen Card */}
      <Card sx={{ width: 400, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h6">Device Last Reported</Typography>
          <Typography variant="body1" color={"success.main"}>
            Last Seen: {localStorage.getItem("last_seen")}
          </Typography>
        </CardContent>
      </Card>

      {/* Buttons for Future Modals */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={() => setResetPassword(true)}>
          Change User Settings
        </Button>
        <Button variant="contained" color="secondary" size="large" onClick={() => setChangeDeviceSettings(true)}>
          Change Device Settings
        </Button>
      </Box>

      {}
      {typeof changeDeviceSettings === "boolean" && (
        <ChangeDeviceSettingModal 
          open={changeDeviceSettings} 
          handleClose={() => setChangeDeviceSettings(false)} 
          frontendConnect={frontendConnect} 
          backendConnect={backendConnect}
        />
      )}
    </Box>
  );
}
