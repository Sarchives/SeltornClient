import { createRef, useEffect, useState } from "react";
import { Guild, Channel, Member } from './interfaces';

function ChannelsList(props: any) {

  const [guild, setGuild] = useState<Guild>();
  const [member, setMember] = useState<Member>();
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
        }
      );

      fetch(props.domain + '/guilds/' + props.guild + '/members/@me', {
        headers: new Headers({
          'Authorization': localStorage.getItem('token') ?? ''
        })
      })
      .then(res => res.json())
      .then((result: Member) => {
       setMember(result);
      }
      );

    }, [props.guild]);


    useEffect(() => {
      if(member) {
      fetch(props.domain + '/guilds/' + props.guild + '/channels', {
        headers: new Headers({
          'Authorization': localStorage.getItem('token') ?? ''
        })
      })
      .then(res => res.json())
      .then((result: Channel[]) => {
        
      result.forEach((x: Channel, i: number) => {
        setChannels(() => {
            let channels: Channel[] = [];
            channels.push(result[i]);
          channels.forEach((channel, i) => {
            if(channel.roles.filter(x => member?.roles.includes(x.id)).map(x => (x.permissions & 0x0000000040) === 0x0000000040).includes(true)) {
              channels[i].ref = createRef();
            } else {
              channels.splice(i, 1);
            }
          });
          return channels;
          });
        });
        }
      );
      }
    }, [member]);

    useEffect(() => {
      props.ws.addEventListener('message', (event: any) => {
        const data = JSON.parse(event.data);
          switch (data.event) {
            case 'channelCreated':
              setChannels(channels => {
                let newChannels = [...channels];
                let newChannel = data.channel;
                if(newChannel.roles.filter((x: any) => member?.roles.includes(x.id)).map((x: any) => (x.permissions & 0x0000000040) === 0x0000000040).includes(true)) {
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