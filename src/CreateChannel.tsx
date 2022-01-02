import { useState } from "react";

function CreateChannel(props: any) {
   const [channelName, setChannelName] = useState('');

   return (<div className="simpleDialog" onKeyDown={(event) => {
      if(event.key === 'Escape') {
         props.setCreateChannel(false);
      }
   }}>
      <button className="unbuttoned simpleDialogClose" onClick={() => props.setCreateChannel(false)}>X</button>
      <h2>Create channel</h2>
      <input type="text" className="simpleDialogInput" value={channelName} maxLength={30} onChange={event => setChannelName(event.target.value)}></input>
      <button className="simpleDialogButton" onClick={() => {
         fetch(props.domain + '/guilds/' + props.guild + '/channels', {
            method: 'POST',
            body: JSON.stringify({ name: channelName }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token') ?? ''
            })
          });
          props.setCreateChannel(false);
      }}>Create</button>
   </div>);
}

export default CreateChannel;