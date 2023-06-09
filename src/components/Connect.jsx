import React, {useState, useEffect} from 'react';
import {getModelStatus} from './chatcomponents/chatapi';

const Connect = () => {
    const [connectionStatus, setConnectionStatus] = useState(false);
    
    useEffect(() => {
        const fetchStatus = async () => {
            if (localStorage.getItem('endpointType') != null){
                if(localStorage.getItem('endpoint') != null && localStorage.getItem('endpointType') !== 'Horde' && localStorage.getItem('endpointType') !== 'OAI'){
                    const status = await getModelStatus();
                    if(status !== null){
                        localStorage.setItem('modelName', status);
                        setConnectionStatus(status);
                    }
                }
                if(localStorage.getItem('endpointType') === 'Horde'){
                    setConnectionStatus(`${localStorage.getItem('hordeModel')} (Horde)`);
                }else if (localStorage.getItem('endpointType') === 'OAI'){
                    setConnectionStatus('Davinci 3 (OAI)');
                }
            }
        }
        fetchStatus();
    }, []);

    return (
        <>
        {connectionStatus ? (
        <p className='connected'><b>Connected: {connectionStatus}</b></p>
        ) : (
        <p className='disconnected'><b>Disconnected</b></p>
        )}
    </>
    )
};

export default Connect;