import { useEffect, useState } from "react";

function EditNickname(props: any) {
   const [nickname, setNickname] = useState('');

   useEffect(() => {
      fetch(props.domain + '/guilds/' + props.guild + '/members/@me', {
         method: 'GET',
         headers: new Headers({
             'Content-Type': 'application/json',
             'Authorization': localStorage.getItem('token') ?? ''
         })
       }).then(res => res.json()).then(result => {
         setNickname(result.nickname);
       });
   }, []);

   return (<div className="simpleDialog" onKeyDown={(event) => {
      if(event.key === 'Escape') {
         props.setEditNickname(false);
      }
   }}>
      <button className="unbuttoned simpleDialogClose" onClick={() => props.setEditNickname(false)}>X</button>
      <h2>Edit nickname</h2>
      <input type="text" className="simpleDialogInput" value={nickname} onChange={event => setNickname(event.target.value)}></input>
      <button className="simpleDialogButton" onClick={() => {
         fetch(props.domain + '/guilds/' + props.guild + '/members/@me', {
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