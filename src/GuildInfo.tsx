import { useEffect, useState } from "react";
import { Guild } from './interfaces';

function GuildInfo(props: any) {

   const [guildName, setGuildName] = useState('');
   const [isOwner, setIsOwner] = useState(true);
   const [canInvite, setCanInvite] = useState(false);
   const [canChangeNickname, setCanChangeNickname] = useState(false);
   const [canManage, setCanManage] = useState(false);
   const [showInfo, setShowInfo] = useState(false);

   useEffect(() => {
      fetch(props.domain + '/guilds/' + props.guild, {
        headers: new Headers({
          'Authorization': localStorage.getItem('token') ?? ''
        })
      })
      .then(res => res.json())
      .then((result: Guild) => {
       setGuildName(result.name);
       setIsOwner(result.members.find(x => x?.id === props.user)?.roles.includes("0") ?? false);
       setCanInvite(result.members.find(x => x?.id === props.user)?.roles.map(role => ((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000001) === 0x0000000001).includes(true) ?? false)
         setCanChangeNickname(result.members.find(x => x?.id === props.user)?.roles.map(role => ((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000200) === 0x0000000200).includes(true) ?? false)
         setCanManage(result.members.find(x => x?.id === props.user)?.roles.map(role => (((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000004) === 0x0000000004) || (((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000010) === 0x0000000010) || (((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000020) === 0x0000000020) || (((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000800) === 0x0000000800)).includes(true) ?? false)
      }
      )
    }, []);

   return (<><button className="unbuttoned guildInfo" onClick={() => setShowInfo(!showInfo)}>
         <h4>{guildName}</h4>
         <span className="fluentIcon guildInfoArrow">&#xf262;</span>
      </button>
      {showInfo ? (<div className="guildMenu">
      {canInvite ? <button className="guildMenuButton">Invite people</button> : null}
      {canManage ? <button className="guildMenuButton">Settings</button> : null}
      {canChangeNickname ? (<button className="guildMenuButton">Edit nickname</button>) : null}
      {!isOwner ? (<button className="guildMenuButton" onClick={() => {
         fetch(props.domain + '/users/@me/guilds/' + props.guild, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': localStorage.getItem('token') ?? '  '
            })
         });
      }}>Leave</button>) : null}
      </div>) : null}
      </>);
}

export default GuildInfo;