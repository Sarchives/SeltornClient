import { useState } from "react";

function EditNickname(props: any) {
   const [nickname, setNickname] = useState('');

   return (<div className="simpleDialog">
      <button className="unbuttoned simpleDialogClose" onClick={() => props.setEditNickname(false)}>X</button>
      <h2>Edit nickname</h2>
      <input type="text" className="simpleDialogInput" value={nickname} onChange={event => setNickname(event.target.value)}></input>
      <button className="simpleDialogButton" onClick={() => {
         fetch(props.domain + '/users/@me/guilds/' + props.guild, {
            method: 'PATCH',
            body: JSON.stringify({ nickname: nickname }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token') ?? ''
            })
          });
          props.setEditNickname(false);
      }}>Edit</button>
   </div>);
}

export default EditNickname;