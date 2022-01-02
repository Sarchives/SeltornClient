import { createRef, useEffect, useState } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import moment from "moment";
import Picker from 'emoji-picker-react';
import ChannelInfo from './ChannelInfo';
import { Guild, Channel, Message, Member } from './interfaces';

function Messages(props: any) {
  const [rerenderValue, rerender] = useState(false);
  const [guild, setGuild] = useState<Guild>();
  const [channel, setChannel] = useState<Channel>();
  const [member, setMember] = useState<Member>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState('');
  const [pins, setPins] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState('');
  const scroll = createRef<HTMLDivElement>();

  useEffect(() => {
    document.addEventListener('selectionchange', () => {
    const selection = document.getSelection();
    if(selection?.toString() !== '') {
      if(selection?.getRangeAt(0)?.startContainer?.parentElement?.parentElement?.parentElement?.id !== '') {
     setSelected(selection?.getRangeAt(0)?.startContainer?.parentElement?.parentElement?.parentElement?.id ?? '');
      } else {
        setSelected(selection?.getRangeAt(0)?.startContainer?.parentElement?.parentElement?.parentElement?.parentElement?.id ?? '');
      }
    } else {
      setSelected('');
    }
  });
  }, []);

  useEffect(() => {
    props.ws.addEventListener('message', (event: any) => {
      const data = JSON.parse(event.data);
      if (props.channel === data.channel) {
        switch (data.event) {
          case 'messageSent':
            setMessages(messages => {
              let newMessages = [...messages];
              let newMessage = data.message;
              newMessage.ref = { message: createRef(), boxIconContainer: createRef() };
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
              newPins.splice(newPins.indexOf(data.message.id), 1);
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
            x.ref = { message: createRef(), boxIconContainer: createRef() };
            return x;
          }
        }
        ));
      });

      fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/pins', {
        headers: new Headers({
          'Authorization': localStorage.getItem('token') ?? ''
        })
      })
        .then(res => res.json())
        .then(result => {
          setPins(result);
        });
  }, [props.channel]);

  useEffect(() => {
    if(guild) {
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
  }
  }, [guild]);

  useEffect(() => {
    if(scroll.current) {
    scroll.current.scrollTop = Number.MAX_SAFE_INTEGER;
    }
  }, [messages]);

  return (<>
  <ChannelInfo domain={props.domain} user={props.user} guild={props.guild} channel={props.channel} ws={props.ws}></ChannelInfo>
  <div className="messagesScroll" ref={scroll}>
    <div className="messages">
      {messages.map(message =>
        message && (<div key={message.id}>
          <ContextMenuTrigger disable={message.id === selected} id={'message-' + message.id} attributes={{ 'id': message.id, 'className': 'messageContainer' + (message?.ref?.message?.current?.contentEditable === 'true' ? ' messageContainerEdit' : '') }}>
            <img src={props.domain + '/icons/users/' + message.author.id + '.png'} alt={message.author.username} className="messagePfp"></img>
            <div className="messagePostPfp">
              <div className="messageInline">
              <h4 className="messageUsername">{message.author.nickname ?? message.author.username}</h4>
              <h6 className="messageDate">{moment(message.creation).calendar()}</h6>
              {pins?.find(x => x.id === message.id) ? <h6 className="fluentIcon">&#xf60b;</h6> : null}
              </div>
              <h5 className="message" ref={message.ref.message} onInput={() => {
                if(message.ref.message.current && message.ref.boxIconContainer.current) {
                  message.ref.message.current.style.height = 'auto';
                  message.ref.message.current.style.height = message.ref.message.current.scrollHeight + 'px';
                  message.ref.boxIconContainer.current.style.height = message.ref.message.current.scrollHeight + 'px';
                }
              }} onKeyDown={(event) => {
                if(event.key === 'Escape') {
                   message.ref.message.current.innerText = message.content;
                   message.ref.message.current.contentEditable = false;
                    message.ref.boxIconContainer.current.style.display = 'none';
                    rerender(!rerenderValue);
                }
             }}>{message.content}</h5>
              <div className="boxIconContainer boxIconContainerEdit" ref={message.ref.boxIconContainer}>
                <button className="fluentIconBorder boxIcon" onClick={() => {
                  if(showEmojiPicker !== message.id) {
          setShowEmojiPicker(message.id);
                  } else {
                    setShowEmojiPicker('');
                  }
      }}>&#xf3e0;</button>
              <button className="fluentIconBorder boxIcon" onClick={() => {
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
                    message.ref.boxIconContainer.current.style.display = 'none';
                    rerender(!rerenderValue);
                  }
                });
              }}>&#xf680;</button>
              </div>
              {showEmojiPicker === message.id ? <div className="emojiPickerEdit" onKeyDown={(event) => {
         if(event.key === 'Escape') {
            setShowEmojiPicker('');
         }
      }}><Picker native onEmojiClick={(event, emoji) => {
     if(message.ref.message.current) {
      const selection = document.getSelection();
        const range = selection?.getRangeAt(0);
        if (range?.commonAncestorContainer.parentNode === message.ref.message.current) {
      message.ref.message.current.innerText = message.ref.message.current?.innerText.substring(0, range?.endOffset) + emoji.emoji + message.ref.message.current?.innerText.substring(range?.endOffset, message.ref.message.current?.innerText.length);
     }
    }
    }} /></div> : null}
              </div>
          </ContextMenuTrigger>
          <ContextMenu id={'message-' + message.id}>
            {props.user === message.author.id ? <MenuItem onClick={() => {
              message.ref.message.current.contentEditable = true;
              message.ref.boxIconContainer.current.style.display = 'inline-flex';
              rerender(!rerenderValue);
            }}>
              <h3 className="fluentIconBorder react-contextmenu-item-icon">&#xf3de;</h3>
            <h3 className="react-contextmenu-item-text">Edit message</h3>
            </MenuItem> : null}
            {member?.roles.map(role => ((channel?.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000100) === 0x0000000100).includes(true) ? <MenuItem onClick={() => {
              if(!pins?.find(x => x.id === message.id)) {
              fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/pins/' + message.id, {
                method: 'POST',
                headers: new Headers({
                  'Authorization': localStorage.getItem('token') ?? ''
                })
              });
            } else {
              fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/pins/' + message.id, {
                method: 'DELETE',
                headers: new Headers({
                  'Authorization': localStorage.getItem('token') ?? ''
                })
              });
            }
            }}>
              {!pins?.find(x => x.id === message.id) ? <h3 className="fluentIconBorder react-contextmenu-item-icon">&#xf602;</h3> : <h3 className="fluentIconBorder react-contextmenu-item-icon">&#xf604;</h3>}
            <h3 className="react-contextmenu-item-text">{!pins?.find(x => x.id === message.id) ? 'P' : 'Unp'}in message</h3>
            </MenuItem> : null}
            {props.user === message.author.id || member?.roles.map(role => ((channel?.roles.find(x => x?.id === role)?.permissions ?? 0) & 0x0000000100) === 0x0000000100).includes(true) ? <MenuItem onClick={() => {
              fetch(props.domain + '/guilds/' + props.guild + '/channels/' + props.channel + '/messages/' + message.id, {
                method: 'DELETE',
                headers: new Headers({
                  'Authorization': localStorage.getItem('token') ?? ''
                })
              });
            }}>
              <h3 className="fluentIconBorder react-contextmenu-item-icon">&#xf34f;</h3>
            <h3 className="react-contextmenu-item-text">Delete message</h3>
            </MenuItem> : null}
            <MenuItem onClick={() => {
              navigator.clipboard.writeText(message.id);
            }}>
              <h3 className="fluentIconBorder react-contextmenu-item-icon">&#xf32c;</h3>
            <h3 className="react-contextmenu-item-text">Copy ID</h3>
            </MenuItem>
          </ContextMenu>
        </div>))}
    </div>
  </div>
  </>);
}

export default Messages;