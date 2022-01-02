import { createRef, useEffect, useState } from "react";
import CreateGuild from "./CreateGuild";
import { Guild } from './interfaces';

function GuildsList(props: any) {
  const createGuildRef = createRef<HTMLDivElement>();

    const [guildsLoaded, setGuildsLoaded] = useState(false);
    const [guildImage, setGuildImage] = useState(new Map());
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [createGuild, setCreateGuild] = useState(false);

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
        );
      });
    } else {
      setGuildsLoaded(true);
    }
    }, []);

    useEffect(() => {
      props.ws.addEventListener('message', (event: any) => {
        const data = JSON.parse(event.data);
          switch (data.event) {
            case 'guildLeft':
              setGuilds(guilds => {
                let newGuilds = [...guilds];
                newGuilds.splice(newGuilds.findIndex(x => x.id === data.guild.id), 1);
                return newGuilds;
              });
              guildImage.delete(data.guild.id);
              props.setFriendsButtonDisabled(true);
              props.setChannel('');
              props.setGuild('');
              break;
            case 'guildJoined':
              setGuilds(guilds => {
                let newGuilds = [...guilds];
                let guild = data.guild;
                guild.ref = createRef();
                newGuilds.push(guild);
                return newGuilds;
              });
              fetch(props.domain + '/icons/guilds/' + data.guild.id + '.png')
        .then(res => {
          if(res.status === 200) {
            setGuildImage(preMap => { 
              let map = new Map(preMap);
              map.set(data.guild.id, <img src={props.domain + '/icons/guilds/' + data.guild.id + '.png'} className="guildIcon" alt="icon"></img>);
              return map;
            });
          } else {
            setGuildImage(preMap => { 
              let map = new Map(preMap);
              map.set(data.guild.id, <div>{data.guild.name.split('')[0]}</div>);
              return map;
            });
          }
          }
        );
        break;

          }
      });
    }, [props.ws]);

    useEffect(() => {
      props.setModalOpened(createGuild);
    }, [createGuild]);

    useOutsideAlerter(createGuildRef);

    function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>) {
      useEffect(() => {
          function handleClickOutside(event: Event) {
              if (ref.current && !ref.current.contains(event.target as Node)) {
                 setCreateGuild(false);
              }
          }
  
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
              document.removeEventListener("mousedown", handleClickOutside);
          };
      }, [ref]);
  }

    if(guildsLoaded) {
    return (<>
    {createGuild ? <div ref={createGuildRef}><CreateGuild domain={props.domain} setCreateGuild={setCreateGuild}></CreateGuild></div> : null}

    <div className="guildsList">
    <div className="guildsListButtonsContainer" >
    <h4 className="guildsListTooltip">Friends</h4>
    <button disabled={props.friendsButtonDisabled} className="fluentIcon guildsListButtons guildsListFirstButton guildsListSpecialButton" onClick={() => {
      if(props.guild) {
        guilds[guilds.findIndex(x => x.id === props.guild)].ref.current.disabled = false;
      }
      props.setFriendsButtonDisabled(true);
      props.setChannel('');
      props.setGuild('');
    }}>&#xf5b4;</button>
    </div>
    {Object.values(guilds).map(guildO => <div className="guildsListButtonsContainer" key={guildO.id}>
    <h4 className="guildsListTooltip">{guildO?.name}</h4>
      <button ref={guildO.ref} className="guildsListButtons" onClick={() => {
      if(props.guild) {
      guilds[guilds.findIndex(x => x.id === props.guild)].ref.current.disabled = false;
      }
      if(props.friendsButtonDisabled) {
        props.setFriendsButtonDisabled(false);
      }
      props.setChannel('');
      props.setGuild(guildO.id);
      guilds[guilds.findIndex(x => x.id === guildO.id)].ref.current.disabled = true;
    }}>{guildImage.get(guildO.id)}</button>
    </div>)}
    <div className="guildsListButtonsContainer" >
         <h4 className="guildsListTooltip">Create guild</h4>
      <button className="fluentIcon guildsListButtons guildsListBottom guildsListSpecialButton"  onClick={() => {
           setCreateGuild(true);
         }}>&#xf10b;</button>
         </div>
  </div>
  </>);
    } else {
      return(<div className="guildsList"></div>);
    }
}

export default GuildsList;