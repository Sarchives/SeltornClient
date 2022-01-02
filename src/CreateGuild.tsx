import { useState } from "react";

function CreateGuild(props: any) {
   const [guildName, setGuildName] = useState('');

   return (<div className="simpleDialog" onKeyDown={(event) => {
      if(event.key === 'Escape') {
         props.setCreateGuild(false);
      }
   }}>
      <button className="unbuttoned simpleDialogClose" onClick={() => props.setCreateGuild(false)}>X</button>
      <h2>Create guild</h2>
      <input type="text" className="simpleDialogInput" value={guildName} maxLength={30} onChange={event => setGuildName(event.target.value)}></input>
      <button className="simpleDialogButton" onClick={() => {
         fetch(props.domain + '/guilds', {
            method: 'POST',
            body: JSON.stringify({ name: guildName }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token') ?? ''
            })
          });
          props.setCreateGuild(false);
      }}>Create</button>
   </div>);
}

export default CreateGuild;