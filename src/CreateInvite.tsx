import { useState } from "react";

function CreateInvite(props: any) {
   const [duration, setDuration] = useState('7d');
   const [uses, setUses] = useState('nou');

   const [inviteCode, setInviteCode] = useState('');

   function getExpiration(duration: string) {
      if(duration.endsWith('m')) {
         return new Date(new Date().setMinutes(new Date().getMinutes() + Number(duration.split('m')[0]))).getTime();
      } else if(duration.endsWith('h')) {
         return new Date(new Date().setHours(new Date().getHours() + Number(duration.split('h')[0]))).getTime();
      } else if(duration.endsWith('d')) {
         return new Date(new Date().setDate(new Date().getDate() + Number(duration.split('d')[0]))).getTime();
      } else if(duration.endsWith('y')) {
         return new Date(new Date().setFullYear(new Date().getFullYear() + Number(duration.split('y')[0]))).getTime();
      } else {
         return;
      }
   }

   return (<div className="simpleDialog" onKeyDown={(event) => {
      if(event.key === 'Escape') {
         props.setCreateInvite(false);
      }
   }}>
      <button className="unbuttoned simpleDialogClose" onClick={() => props.setCreateInvite(false)}>X</button>
      <h2>Invite people</h2>
      <h4>Use the link below to invite people to the guild:</h4>
      <input type="text" className="simpleDialogInput" value={inviteCode} readOnly></input>
      <div className="simpleDialogLine"></div>
      <label htmlFor="duration">Duration:</label>
      <select defaultValue="7d" id="duration" className="simpleDialogSelect" onChange={event => {
         setDuration(event.target.value);
      }}>
  <option value="30m">30 minutes</option>
  <option value="1h">1 hour</option>
  <option value="6h">6 hours</option>
  <option value="12h">12 hours</option>
  <option value="1d">1 day</option>
  <option value="7d">7 days (default)</option>
  <option value="100y">100 years</option>
</select>
      <label htmlFor="uses">Uses:</label>
      <select defaultValue="nou" id="uses" className="simpleDialogSelect" onChange={event => {
         setUses(event.target.value);
      }}>
  <option value="nou">No limit (default)</option>
  <option value="1u">1 use</option>
  <option value="5u">5 uses</option>
  <option value="10u">10 uses</option>
  <option value="25u">25 uses</option>
  <option value="50u">50 uses</option>
  <option value="100u">100 uses</option>
</select>
      <button className="simpleDialogButton" onClick={() => {
         fetch(props.domain + '/guilds/' + props.guild + '/invites', {
            method: 'POST',
            body: JSON.stringify({ expiration: getExpiration(duration), maxUses: Number(uses.split('u')[0]) }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token') ?? ''
            })
          }).then(res => res.json()).then(result => {
            setInviteCode(window.location.protocol + '//' + window.location.host + '/invite/' + result.code);
          });
      }}>Create invite</button>
   </div>);
}

export default CreateInvite;