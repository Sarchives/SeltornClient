import { useEffect, useState } from "react";
import { Guild } from './interfaces';

function ChannelInfo(props: any) {

    const [canManage, setCanManage] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
      fetch(props.domain + '/guilds/' + props.guild, {
        headers: new Headers({
          'Authorization': localStorage.getItem('token') ?? ''
        })
      })
      .then(res => res.json())
      .then((result: Guild) => {
        setCanManage(result.members.find(x => x?.id === props.user)?.roles.map(role => (((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000004) === 0x0000000004) || (((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000010) === 0x0000000010) || (((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000020) === 0x0000000020) || (((result.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000800) === 0x0000000800)).includes(true) ?? false)
      }
      )
    }, []);

    useEffect(() => {
        fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel, {
            headers: new Headers({
              'Authorization': localStorage.getItem('token') ?? ''
            })
          })
          .then(res => res.json())
          .then(result => {
              setName(result.name);
            })
    }, []);

   return (<div className="channelInfo">
       <h4 className="channelInfoName"># {name}</h4>
       <div className="channelInfoButtons">
       <button className="unbuttoned fluentIcon channelInfoButton">&#xf60b;</button>
       {canManage ? <button className="unbuttoned fluentIcon channelInfoButton">&#xf6b4;</button> : null}
       </div>
   </div>);
}

export default ChannelInfo;