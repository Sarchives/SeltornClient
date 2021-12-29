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
  const [loaded, setLoaded] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
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

  function connectWebsocket(token: string) {
    const ws = new WebSocket((domain.startsWith("https") ? 'wss://' : 'ws://') + domain.split('//')[1] + '/socket?token=' + token);
    
    ws.onopen = () => {
      console.info('[WebSocket] Connected');
      setLoaded(true);
    };

    ws.onclose = () => {
      console.warn('[WebSocket] Disconnected');
      window.location.reload();  
    }

    ws.onerror = () => {
      console.error('[WebSocket] Error');
      window.location.reload(); 
    }
    return ws;
  }

  if(loaded && user) {
  return (
    <>
    {modalOpened ? <div className="opacitier"></div> : null}
    <UserInfo domain={domain}></UserInfo>
    <GuildsList domain={domain} guilds={guilds} guild={guild} setGuild={setGuild} setChannel={setChannel} friendsButtonDisabled={friendsButtonDisabled} setFriendsButtonDisabled={setFriendsButtonDisabled}></GuildsList>
    <div className="actualContent">
    {guild ? (
      <>
      <div className="sidebar">
      <GuildInfo domain={domain} guild={guild} user={user} setModalOpened={setModalOpened}></GuildInfo>
    <ChannelsList domain={domain} user={user} guild={guild} channel={channel} setChannel={setChannel} ws={ws}></ChannelsList>
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