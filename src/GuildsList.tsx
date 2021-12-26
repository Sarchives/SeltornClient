import { createRef, useEffect, useState } from "react";
import { Guild } from './interfaces';

function GuildsList(props: any) {
    const [guildsLoaded, setGuildsLoaded] = useState(false);
    const [guildImage, setGuildImage] = useState(new Map());
    const [guilds, setGuilds] = useState<Guild[]>([]);

    useEffect(() => {
      if(props.guilds.length > 0) {
      props.guilds.forEach((guildO: Guild, index: number) => {
        setGuilds(preGuilds => {
          let guilds = [...preGuilds];
          guilds.push(guildO);
        guilds[guilds.length - 1].ref = createRef();
        return guilds;
        });
        fetch(props.domain + '/icons/guilds/' + guildO.id + '.png')
        .then(res => {
          if(res.status === 200) {
            setGuildImage(preMap => { 
              let map = new Map(preMap);
              map.set(guildO.id, <img src={props.domain + '/icons/guilds/' + guildO.id + '.png'} className="guildIcon" alt="icon"></img>);
              return map;
            });
          } else {
            setGuildImage(preMap => { 
              let map = new Map(preMap);
              map.set(guildO.id, <div>{guildO.name.split('')[0]}</div>);
              return map;
            });
          }
          if(props.guilds.length === (index + 1)) {
            setGuildsLoaded(true);
          }
          }
        )
      });
    } else {
      setGuildsLoaded(true);
    }
    }, []);

    if(guildsLoaded) {
    return (<div className="guildsList">
    <button disabled={props.friendsButtonDisabled} className="fluentIcon guildsListButtons guildsListFirstButton guildsListSpecialButton" onClick={() => {
      if(props.guild) {
        guilds[guilds.findIndex(x => x.id === props.guild)].ref.current.disabled = false;
      }
      props.setFriendsButtonDisabled(true);
      props.setChannel('');
      props.setGuild('');
    }}>&#xf5b4;</button>
    {Object.values(guilds).map(guildO => <button ref={guildO.ref} className="guildsListButtons" onClick={() => {
      if(props.guild) {
      guilds[guilds.findIndex(x => x.id === props.guild)].ref.current.disabled = false;
      }
      if(props.friendsButtonDisabled) {
        props.setFriendsButtonDisabled(false);
      }
      props.setChannel('');
      props.setGuild(guildO.id);
      guilds[guilds.findIndex(x => x.id === guildO.id)].ref.current.disabled = true;
    }}>{guildImage.get(guildO.id)}</button>)}
    <button className="fluentIcon guildsListButtons guildsListBottom guildsListSpecialButton">&#xf10b;</button>
  </div>);
    } else {
      return(<div className="guildsList"></div>);
    }
}

export default GuildsList;