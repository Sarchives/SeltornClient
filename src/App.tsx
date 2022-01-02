import { useEffect, useState } from 'react';
import Home from './Home';
import Verify from './Verify';
import JoinGuild from './JoinGuild';
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

  const [theme, setTheme] = useState('blueGrey');
  const [ws, setWs] = useState<WebSocket>();
  const [loaded, setLoaded] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [user, setUser] = useState('');
  const [guilds, setGuilds] = useState([]);
  const [friendsButtonDisabled, setFriendsButtonDisabled] = useState(true);
  const [guild, setGuild] = useState('');
  const [channel, setChannel] = useState('');

  useEffect(() => {
    if(localStorage.getItem('theme')) {
      setTheme(localStorage.getItem('theme') ?? 'blueGrey');
    }

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
    localStorage.setItem('theme', theme);

    switch(theme) {
      case 'red':
        document.documentElement.style.setProperty('--50', '#ffebee');
        document.documentElement.style.setProperty('--100', '#ffcdd2');
        document.documentElement.style.setProperty('--200', '#ef9a9a');
        document.documentElement.style.setProperty('--300', '#e57373');
        break;
      case 'pink':
        document.documentElement.style.setProperty('--50', '#fce4ec');
        document.documentElement.style.setProperty('--100', '#f8bbd0');
        document.documentElement.style.setProperty('--200', '#f48fb1');
        document.documentElement.style.setProperty('--300', '#f06292');
        break;
      case 'purple':
        document.documentElement.style.setProperty('--50', '#f3e5f5');
        document.documentElement.style.setProperty('--100', '#e1bee7');
        document.documentElement.style.setProperty('--200', '#ce93d8');
        document.documentElement.style.setProperty('--300', '#ba68c8');
        break;
      case 'deepPurple':
        document.documentElement.style.setProperty('--50', '#ede7f6');
        document.documentElement.style.setProperty('--100', '#d1c4e9');
        document.documentElement.style.setProperty('--200', '#b39ddb');
        document.documentElement.style.setProperty('--300', '#9575cd');
        break;
      case 'indigo':
        document.documentElement.style.setProperty('--50', '#e8eaf6');
        document.documentElement.style.setProperty('--100', '#c5cae9');
        document.documentElement.style.setProperty('--200', '#9fa8da');
        document.documentElement.style.setProperty('--300', '#7986cb');
        break;
      case 'blue':
        document.documentElement.style.setProperty('--50', '#e3f2fd');
        document.documentElement.style.setProperty('--100', '#bbdefb');
        document.documentElement.style.setProperty('--200', '#90caf9');
        document.documentElement.style.setProperty('--300', '#64b5f6');
        break;
      case 'lightBlue':
        document.documentElement.style.setProperty('--50', '#e1f5fe');
        document.documentElement.style.setProperty('--100', '#b3e5fc');
        document.documentElement.style.setProperty('--200', '#81d4fa');
        document.documentElement.style.setProperty('--300', '#4fc3f7');
        break;
      case 'cyan':
        document.documentElement.style.setProperty('--50', '#e0f7fa');
        document.documentElement.style.setProperty('--100', '#b2ebf2');
        document.documentElement.style.setProperty('--200', '#80deea');
        document.documentElement.style.setProperty('--300', '#4dd0e1');
        break;
      case 'teal':
        document.documentElement.style.setProperty('--50', '#e0f2f1');
        document.documentElement.style.setProperty('--100', '#b2dfdb');
        document.documentElement.style.setProperty('--200', '#80cbc4');
        document.documentElement.style.setProperty('--300', '#4db6ac');
        break;
      case 'green':
        document.documentElement.style.setProperty('--50', '#e8f5e9');
        document.documentElement.style.setProperty('--100', '#c8e6c9');
        document.documentElement.style.setProperty('--200', '#a5d6a7');
        document.documentElement.style.setProperty('--300', '#81c784');
        break;
      case 'lightGreen':
        document.documentElement.style.setProperty('--50', '#f1f8e9');
        document.documentElement.style.setProperty('--100', '#dcedc8');
        document.documentElement.style.setProperty('--200', '#c5e1a5');
        document.documentElement.style.setProperty('--300', '#aed581');
        break;
      case 'lime':
        document.documentElement.style.setProperty('--50', '#f9fbe7');
        document.documentElement.style.setProperty('--100', '#f0f4c3');
        document.documentElement.style.setProperty('--200', '#e6ee9c');
        document.documentElement.style.setProperty('--300', '#dce775');
        break;
      case 'yellow':
        document.documentElement.style.setProperty('--50', '#fffde7');
        document.documentElement.style.setProperty('--100', '#fff9c4');
        document.documentElement.style.setProperty('--200', '#fff59d');
        document.documentElement.style.setProperty('--300', '#fff176');
        break;
      case 'amber':
        document.documentElement.style.setProperty('--50', '#fff8e1');
        document.documentElement.style.setProperty('--100', '#ffecb3');
        document.documentElement.style.setProperty('--200', '#ffe082');
        document.documentElement.style.setProperty('--300', '#ffd54f');
        break;
      case 'orange':
        document.documentElement.style.setProperty('--50', '#fff3e0');
        document.documentElement.style.setProperty('--100', '#ffe0b2');
        document.documentElement.style.setProperty('--200', '#ffcc80');
        document.documentElement.style.setProperty('--300', '#ffb74d');
        break;
      case 'deepOrange':
        document.documentElement.style.setProperty('--50', '#fbe9e7');
        document.documentElement.style.setProperty('--100', '#ffccbc');
        document.documentElement.style.setProperty('--200', '#ffab91');
        document.documentElement.style.setProperty('--300', '#ff8a65');
        break;
      case 'brown':
        document.documentElement.style.setProperty('--50', '#efebe9');
        document.documentElement.style.setProperty('--100', '#d7ccc8');
        document.documentElement.style.setProperty('--200', '#bcaaa4');
        document.documentElement.style.setProperty('--300', '#a1887f');
        break;
      case 'grey':
        document.documentElement.style.setProperty('--50', '#fafafa');
        document.documentElement.style.setProperty('--100', '#f5f5f5');
        document.documentElement.style.setProperty('--200', '#eeeeee');
        document.documentElement.style.setProperty('--300', '#e0e0e0');
        break;
      case 'blueGrey':
        document.documentElement.style.setProperty('--50', '#eceff1');
        document.documentElement.style.setProperty('--100', '#cfd8dc');
        document.documentElement.style.setProperty('--200', '#b0bec5');
        document.documentElement.style.setProperty('--300', '#90a4ae');
        break;
    }
  }, [theme]);

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

  if(window.location.pathname === '/') {
    return (<Home theme={theme} setTheme={setTheme}></Home>);
  } else if(window.location.pathname.startsWith('/verify')) {
    return (<Verify domain={domain}></Verify>);
  } else if(loaded && user) {
    if(window.location.pathname.startsWith('/invites')) {
      return (<JoinGuild domain={domain} setModalOpened={setModalOpened}></JoinGuild>)
    } else {
  return (
    <>
    {modalOpened ? <div className="opacitier"></div> : null}
    <UserInfo domain={domain} theme={theme} setTheme={setTheme}></UserInfo>
    <GuildsList domain={domain} guilds={guilds} guild={guild} setGuild={setGuild} setChannel={setChannel} friendsButtonDisabled={friendsButtonDisabled} setFriendsButtonDisabled={setFriendsButtonDisabled} setModalOpened={setModalOpened} ws={ws}></GuildsList>
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
    }
  } else {
    if(!loaded || user) {
      return (<LoadingScreen></LoadingScreen>);
    } else {
      return (<LoginScreen domain={domain}></LoginScreen>);
    }
  }
}

export default App;