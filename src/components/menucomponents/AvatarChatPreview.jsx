import React from 'react';
import './profmenu.css'

const AvatarChatPreview = ({ sender, avatar, onClose }) => {
  const botname = 'Mika';
  const defaultAvatar = 'https://cdn.discordapp.com/attachments/1070388301397250170/1072227534713921616/tmpu7e13o19.png';
  
  return (
    <div className='modal-overlay'>
      <div style={{ background: 'grey', width: '200px', height: '100px' }}>
        <div id='senderPreview'>
          <div id='senderName'>{sender}</div>
          <img src={avatar || defaultAvatar} alt="avatar" className="avatar incoming-avatar" />
          <p>This is what your messages will look like!</p>
        </div>
      </div>
      <div id='AIPreview'>
        <div id='botname'>{botname}</div>
        <img src={avatar || defaultAvatar} alt="avatar" className="avatar outgoing-avatar" />
        <p>This is what the AI's messages will look like!</p>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default AvatarChatPreview;
