import React, { useEffect, useState } from 'react';

const GroupChatSettings = ({settings}) => {
    const [groupChatSettings, setGroupChatSettings] = useState(null);
    
    useEffect(() => {
        const fetchGroupChatSettings = async () => {
            const groupChatSettings = settings['GroupChatSettings']
            setGroupChatSettings(groupChatSettings);
        };
        fetchGroupChatSettings();
    }, [settings]);

    if(groupChatSettings === null) {
        return (
            <>
            </>
        );
    }

    return (
        <>
        </>
    );
}

export default GroupChatSettings;