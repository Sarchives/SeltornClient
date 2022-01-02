import { ReactElement, useEffect, useState } from "react";
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';
import { Guild } from "./interfaces";

function JoinGuild(props: any) {
    const [guild, setGuild] = useState<Guild>();
    const [guildImage, setGuildImage] = useState<ReactElement<any, any>>();
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(props.domain + window.location.pathname, {
            headers: new Headers({
              'Authorization': localStorage.getItem('token') ?? ''
            })
          })
          .then(res => res.json())
          .then(result => {
              if(result.id) {
              setGuild(result);
              } else {
                  setError(true);
              }
            });
    }, []);

    useEffect(() => {
        if(guild) {
            fetch(props.domain + '/icons/guilds/' + guild.id + '.png')
        .then(res => {
          if(res.status === 200) {
            setGuildImage(<img src={props.domain + '/icons/guilds/' + guild.id + '.png'} className="guildIcon" alt="icon"></img>);
          } else {
            setGuildImage(<div>{guild.name.split('')[0]}</div>);
          }
          }
        );
        }
    }, [guild]);

   if(!error && guild && guildImage) {
    return (<div className="simpleDialog">
        <div className="joinGuildImage">{guildImage}</div>
        <h2>Join {guild.name}</h2>
        <h4 className="joinGuildMembers">{guild.members} member{guild.members !== 1 ? 's' : ''}</h4>
        <button className="simpleDialogButton" onClick={() => {
           fetch(props.domain + window.location.pathname, {
              method: 'POST',
              headers: new Headers({
                  'Authorization': localStorage.getItem('token') ?? ''
              })
            }).then(res => {
                if(res.status === 200) {
              window.location.pathname = '/app';
                } else {
                    setError(true);
                }
            });
        }}>Join</button>
     </div>);
   } else if(!error) {
    return (<LoadingScreen></LoadingScreen>);
   } else {
    return (<ErrorScreen error={'Error while ' + (guild ? 'accepting' : 'getting') + ' this invite.'}></ErrorScreen>);
   }
}

export default JoinGuild;