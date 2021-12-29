import { useEffect, useState, createRef } from "react";
import moment from "moment";
import { Guild, Channel, Message } from './interfaces';

function ChannelInfo(props: any) {

  const pinsRef = createRef<HTMLDivElement>();

    const [canManage, setCanManage] = useState(false);
    const [channel, setChannel] = useState<Channel>();
    const [pins, setPins] = useState<Message[]>([]);
    const [showPins, setShowPins] = useState(false);
   const [notOnWait, setNotOnWait] = useState(true);

   useEffect(() => {
    props.ws.addEventListener('message', (event: any) => {
      const data = JSON.parse(event.data);
      if (props.channel === data.channel) {
        switch (data.event) {
            case 'messagePinned':
            setPins(pins => {
              let newPins = [...pins];
              newPins.push(data.message)
              return newPins;
            });
            break;
            case 'messageUnpinned':
            setPins(pins => {
              let newPins = [...pins];
              newPins.splice(newPins.indexOf(data.message.id ), 1);
              return newPins;
            });
            break;
        }
      }
    });
  }, [props.ws]);

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
              setChannel(result);
            })
    }, []);

    useEffect(() => {
      fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/pins', {
          headers: new Headers({
            'Authorization': localStorage.getItem('token') ?? ''
          })
        })
        .then(res => res.json())
        .then(result => {
            setPins(result);
          })
  }, []);

    useOutsideAlerter(pinsRef);

    function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>) {
      useEffect(() => {
          function handleClickOutside(event: Event) {
              if (ref.current && !ref.current.contains(event.target as Node)) {
                 setNotOnWait(false);
                  setShowPins(false);
              }
          }
  
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
              document.removeEventListener("mousedown", handleClickOutside);
          };
      }, [ref]);
    }

   return (<div className="channelInfo">
       <h4 className="channelInfoName"># {channel?.name}</h4>
       <div className="channelInfoButtons">
       <button className="unbuttoned fluentIcon channelInfoButton" onClick={() => {
         if(!showPins && notOnWait) {
          setShowPins(true); 
         } else if(!notOnWait) {
            setNotOnWait(true);
         }
      }} onKeyDown={(event) => {
         if(event.key === 'Escape') {
            setShowPins(false);
         }
      }}>&#xf60b;</button>
      {showPins ? <div ref={pinsRef} className="pinsBox">
      {pins.map(message =>
        message && (<>
          <div className="messageContainer pinMessageContainer">
            <img src={props.domain + '/icons/users/' + message.author.id + '.png'} alt={message.author.username} className="messagePfp"></img>
            <div className="messagePostPfp">
              <div className="messageInline">
              <h4 className="messageUsername">{message.author.nickname ?? message.author.username}</h4>
              <h6 className="messageDate">{moment(message.creation).calendar()}</h6>
              <button className="unbuttoned fluentIcon pinX" onClick={() => {
                fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/pins/' + message.id, {
                  method: 'DELETE',
                  headers: new Headers({
                    'Authorization': localStorage.getItem('token') ?? ''
                  })
                });
              }}>&#xf60e;</button>
              </div>
              <h5 className="message">{message.content}</h5>
            </div>
            </div>
        </>))}
      </div> : null}
       {canManage ? <button className="unbuttoned fluentIcon channelInfoButton">&#xf6b4;</button> : null}
       </div>
   </div>);
}

export default ChannelInfo;