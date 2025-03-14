import axios from 'axios';
import { useContext, useState } from 'react';
import { ConnectionContext } from '../../components/ConnectionContext';
/*
export const updateVent = async (value) => { //Send request to either frontend or backend, 
    const { frontendConnect, backendConnect, deviceConnected, setFrontendConnect, setBackendConnect, setDeviceConnected } = useContext(ConnectionContext);

    if(!deviceConnected){
        console.log("Device not connected...cannot send request to servo to open");
    }
    else if(!frontendConnect){ //Backend Relay (WORK ON THIS)
        console.log("Cannot open/close vent, implement backend relay");
    }
    else{ //Frontend 
        console.log("Frontend servo ");

    }
  
  
  }
*.