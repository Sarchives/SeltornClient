import { createRef, useEffect, useState } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import ChannelInfo from './ChannelInfo';
import { Guild, Channel, Message } from './interfaces';

function Messages(props: any) {
  const [guild, setGuild] = useState<Guild>();
  const [channel, setChannel] = useState<Channel>();
  const [messages, setMessages] = useState<Message[]>([]);
  const scroll = createRef<HTMLDivElement>();

  useEffect(() => {
    props.ws.onmessage = ((event: any) => {
      const data = JSON.parse(event.data);
      if (props.channel === data.channel) {
        switch (data.event) {
          case 'messageSent':
            setMessages(messages => {
              let newMessages = [...messages];
              let newMessage = data.message;
              newMessage.ref = { message: createRef(), saveButton: createRef() };
              newMessages.push(newMessage);
              return newMessages;
            });
            break;
          case 'messageEdited':
            setMessages(messages => {
              let newMessages = [...messages];
              newMessages[newMessages.findIndex(x => x?.id === data.message.id)].content = data.message.content;
              return newMessages;
            });
            break;
          case 'messageDeleted':
            setMessages(messages => {
              let newMessages = [...messages];
              delete newMessages[newMessages.findIndex(x => x?.id === data.message.id)];
              return newMessages;
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
      .then(result => {
        setGuild(result);
      });

    fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel, {
      headers: new Headers({
        'Authorization': localStorage.getItem('token') ?? ''
      })
    })
      .then(res => res.json())
      .then(result => {
        setChannel(result);
      });

    fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/messages', {
      headers: new Headers({
        'Authorization': localStorage.getItem('token') ?? ''
      })
    })
      .then(res => res.json())
      .then(result => {
        setMessages(result.map((x: Message) => {
          if (x) {
            x.ref = { message: createRef(), saveButton: createRef() };
            return x;
          }
        }
        ));
      });
  }, [props.channel]);

  useEffect(() => {
    if(scroll.current) {
    scroll.current.scrollTop = Number.MAX_SAFE_INTEGER;
    }
  }, [messages]);

  return (<>
  <ChannelInfo domain={props.domain} user={props.user} guild={props.guild} channel={props.channel}></ChannelInfo>
  <div className="messagesScroll" ref={scroll}>
    <div className="messages">
      {messages.map(message =>
        message && (<>
          <ContextMenuTrigger id={'message-' + message.id} attributes={{ 'className': 'messageContainer' }}>
            <img src={props.domain + '/icons/users/' + message.author.id + '.png'} alt={message.author.username} className="messagePfp"></img>
            <div className="messagePostPfp">
              <h4 className="messageUsername">{message.author.nickname ?? message.author.username}</h4>
              <h5 className="message" ref={message.ref.message}>{message.content}</h5>
              <button className="messageSaveButton" ref={message.ref.saveButton} onClick={() => {
                fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/messages/' + message.id, {
                  method: 'PATCH',
                  body: JSON.stringify({ message: message.ref.message.current.innerText }),
                  headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') ?? ''
                  })
                }).then(res => {
                  if (res.status === 200) {
                    message.ref.message.current.contentEditable = false;
                    message.ref.saveButton.current.style.display = 'none';
                  }
                });
              }}>Save</button>
            </div>
          </ContextMenuTrigger>
          <ContextMenu id={'message-' + message.id}>
            {props.user === message.author.id ? <MenuItem onClick={() => {
              console.log(message);
              message.ref.message.current.contentEditable = true;
              message.ref.saveButton.current.style.display = 'inline-block';
            }}>Edit message</MenuItem> : null}
            {guild?.members.find(x => x?.id === props.user)?.roles.map(role => ((channel?.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000100) === 0x0000000100).includes(true) ? <MenuItem>Pin message</MenuItem> : null}
            {props.user === message.author.id || guild?.members.find(x => x?.id === props.user)?.roles.map(role => ((channel?.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000100) === 0x0000000100).includes(true) ? <MenuItem onClick={() => {
              fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/messages/' + message.id, {
                method: 'DELETE',
                headers: new Headers({
                  'Authorization': localStorage.getItem('token') ?? ''
                })
              });
            }}>Delete message</MenuItem> : null}
            <MenuItem onClick={() => {
              navigator.clipboard.writeText(message.id);
            }}>Copy ID</MenuItem>
          </ContextMenu>
        </>))}
    </div>
  </div>
  </>);
}

export default Messages;