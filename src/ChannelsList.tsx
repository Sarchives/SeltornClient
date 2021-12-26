import { createRef, useEffect, useState } from "react";
import { Guild, Channel } from './interfaces';

function ChannelsList(props: any) {

  const [channels, setChannels] = useState<Channel[]>([]);

    useEffect(() => {
      fetch(props.domain + '/guilds/' + props.guild, {
        headers: new Headers({
          'Authorization': localStorage.getItem('token') ?? ''
        })
      })
      .then(res => res.json())
      .then((result: Guild) => {
        result.channels.forEach((x: Channel, i: number) => {
        setChannels(preChannels => {
            let channels = [...preChannels];
            channels.push(result.channels[i]);
          channels.forEach((channel, i) => {
            if(channel.roles.filter(x => result.members.find(x => x?.id === props.user)?.roles.includes(x.id)).map(x => (x.permissions & 0x0000000040) === 0x0000000040).includes(true)) {
              channels[i].ref = createRef();
            } else {
              channels.splice(i, 1);
            }
          });
          return channels;
          });
        });
        }
      )
    }, []);

   return (<>{channels.map(channel => <button ref={channel.ref} className="channel" onClick={() => {
    if(props.channel) {
      channels[channels.findIndex(x => x.id === props.channel)].ref.current.disabled = false;
      }
      props.setChannel(channel.id);
      channels[channels.findIndex(x => x.id === channel.id)].ref.current.disabled = true;
   }}># {channel.name}</button>)}</>);
}

export default ChannelsList;