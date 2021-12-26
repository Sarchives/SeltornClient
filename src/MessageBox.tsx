import { createRef, useEffect, useState } from "react";

function MessageBox(props: any) {
    const [channelName, setChannelName] = useState('');
    const [message, setMessage] = useState('');
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
    <button className="boxIcon fluentIconBorder">&#xf3e0;</button>
    <button className="boxIcon fluentIcon">&#xf10b;</button>
   </div>
   <button className="sendButton fluentIcon" onClick={() => {
       if(message) {
    fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/messages', {
        method: 'POST',
        body: JSON.stringify({ message: message }),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') ?? ''
        })
      }).then(res => {
          if(res.status === 200) {
            setMessage('');
          }
      })
    }
   }}>&#xf6a4;</button>
   </div>);
}

export default MessageBox;