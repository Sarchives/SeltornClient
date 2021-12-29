import { createRef, useEffect, useState } from "react";
import { Guild, Channel, Role } from './interfaces';

function ChannelsList(props: any) {

  const [guild, setGuild] = useState<Guild>();
  const [channels, setChannels] = useState<Channel[]>([]);

    useEffect(() => {
      fetch(props.domain + '/guilds/' + props.guild, {
        headers: new Headers({
          'Authorization': localStorage.getItem('token') ?? ''
        })
      })
      .then(res => res.json())
      .then((result: Guild) => {
        setGuild(result);
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

    useEffect(() => {
      props.ws.addEventListener('message', (event: any) => {
        const data = JSON.parse(event.data);
          switch (data.event) {
            case 'channelCreated':
              setChannels(channels => {
                let newChannels = [...channels];
                let newChannel = data.channel;
                if(newChannel.roles.filter((x: any) => guild?.members.find(x => x?.id === props.user)?.roles.includes(x.id)).map((x: any) => (x.permissions & 0x0000000040) === 0x0000000040).includes(true)) {
                newChannel.ref = createRef();
                newChannels.push(newChannel);
                }
                return newChannels;
              });
              break;
          }
      });
    }, [props.ws, guild]);

   return (<>{channels.map(channel => <button key={channel.id} ref={channel.ref} className="channel" onClick={() => {
    if(props.channel) {
      channels[channels.findIndex(x => x.id === props.channel)].ref.current.disabled = false;
      }
      props.setChannel(channel.id);
      channels[channels.findIndex(x => x.id === channel.id)].ref.current.disabled = true;
   }}><h3># {channel.name}</h3></button>)}</>);
}

export default ChannelsList;