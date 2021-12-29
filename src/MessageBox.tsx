import { createRef, useEffect, useState } from "react";
import Picker from 'emoji-picker-react';

function MessageBox(props: any) {
    const [channelName, setChannelName] = useState('');
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const box = createRef<HTMLTextAreaElement>();
    const boxIconContainer = createRef<HTMLDivElement>();

    useEffect(() => {
      fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel, {
        headers: new Headers({
          'Authorization': localStorage.getItem('token') ?? ''
        })
      })
      .then(res => res.json())
      .then(result => {
        setChannelName(result.name);
        }
      )
    }, [props.channel]);

    useEffect(() => {
      if(box.current && boxIconContainer.current) {
        box.current.style.height = 'auto';
    box.current.style.height = box.current.scrollHeight + 'px';
    boxIconContainer.current.style.height = box.current.scrollHeight + 'px';
      }
    }, [message]);

   return (<div className="messageBoxContainer">
       <textarea ref={box} placeholder={'Write message to ' + channelName} value={message} className="messageBox" rows={1} maxLength={4000} onChange={event => {
    setMessage(event.target.value);
   }}></textarea>
   <div className="boxIconContainer" ref={boxIconContainer}>
    <button className="boxIcon fluentIconBorder" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>&#xf3e0;</button>
    <button className="boxIcon fluentIcon">&#xf10b;</button>
   </div>
   {showEmojiPicker ? <div className="emojiPicker" onKeyDown={(event) => {
         if(event.key === 'Escape') {
            setShowEmojiPicker(false);
         }
      }}><Picker native onEmojiClick={(event, emoji) => {
     if(box.current) {
     setMessage(box.current?.value.substring(0, box.current?.selectionStart) + emoji.emoji + box.current?.value.substring(box.current?.selectionStart, box.current?.value.length));
     }
    }} /></div> : null}
   <button className="sendButton fluentIcon" disabled={!message} onClick={() => {
     setMessage('');
    fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/messages', {
        method: 'POST',
        body: JSON.stringify({ message: message }),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') ?? ''
        })
      });
   }}>&#xf6a4;</button>
   </div>);
}

export default MessageBox;