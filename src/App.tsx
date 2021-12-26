import { useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import LoadingScreen from './LoadingScreen';
import LoginScreen from './LoginScreen';
import GuildsList from './GuildsList';
import GuildInfo from './GuildInfo';
import ChannelsList from './ChannelsList';
import Messages from './Messages';
import MessageBox from './MessageBox';
import Friends from './Friends';

const domain = process.env.REACT_APP_DOMAIN ?? '';

function App() {

  const [ws, setWs] = useState<WebSocket>();
  const [websocketLost, setWebsocketLost] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState('');
  const [guilds, setGuilds] = useState([]);
  const [friendsButtonDisabled, setFriendsButtonDisabled] = useState(true);
  const [guild, setGuild] = useState('');
  const [channel, setChannel] = useState('');

  useEffect(() => {
    if(localStorage.getItem("token")) {
      fetch(domain + '/users/@me', {
        headers: new Headers({
          'Authorization': localStorage.getItem('token') ?? ''
        })
      })
      .then(res => {
        if(res.status === 200) {
        return res.json()
        } else {
          return {};
        }
      })
      .then((result: any) => {
        if(result?.id) {
        setUser(result.id);
        fetch(domain + '/users/@me/guilds', {
          headers: new Headers({
            'Authorization': localStorage.getItem('token') ?? ''
          })
        })
        .then(res => res.json())
        .then(result => {
            setGuilds(result);
            setWs(connectWebsocket(localStorage.getItem('token') ?? ''));
          });
        } else {
          setLoaded(true);
        }
      });

    } else {
    setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if(websocketLost) {
    window.location.reload();  
    }
  }, [websocketLost]);

  function connectWebsocket(token: string) {
    const ws = new WebSocket((domain.startsWith("https") ? 'wss://' : 'ws://') + domain.split('//')[1] + '/socket?token=' + token);
    
    ws.onopen = () => {
      console.info('[WebSocket] Connected');
    };

    ws.onclose = () => {
      console.warn('[WebSocket] Disconnected');
      setWebsocketLost(true);
    }

    setLoaded(true);
    return ws;
  }

  if(loaded) {
  return (
    <>
    <UserInfo domain={domain}></UserInfo>
    <GuildsList domain={domain} guilds={guilds} guild={guild} setGuild={setGuild} setChannel={setChannel} friendsButtonDisabled={friendsButtonDisabled} setFriendsButtonDisabled={setFriendsButtonDisabled}></GuildsList>
    <div className="actualContent">
    {guild ? (
      <>
      <div className="sidebar">
      <GuildInfo domain={domain} guild={guild} user={user}></GuildInfo>
    <ChannelsList domain={domain} user={user} guild={guild} channel={channel} setChannel={setChannel}></ChannelsList>
    </div>
    {channel ? <>
    <Messages domain={domain} user={user} guild={guild} channel={channel} ws={ws}></Messages>
    <MessageBox domain={domain} guild={guild} channel={channel}></MessageBox>
    </> : null}
    </>
    ) : <Friends></Friends>}
</div>
    </>
  );
  } else {
    if(!loaded || user) {
      return (<LoadingScreen></LoadingScreen>);
    } else {
      return (<LoginScreen domain={domain}></LoginScreen>);
    }
  }
}

export default App;