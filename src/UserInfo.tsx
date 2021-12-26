import { useEffect, useState } from "react";

function UserInfo(props: any) {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        fetch(props.domain + '/users/@me', {
            headers: new Headers({
              'Authorization': localStorage.getItem('token') ?? ''
            })
          })
          .then(res => res.json())
          .then(result => {
              setUsername(result.username);
              setId(result.id);
            })
    }, []);

   return (<div className="userInfo">
       <img src={props.domain + '/icons/users/' + {id} + '.png'} alt={username} className="userInfoPfp"></img>
       <h4 className="userInfoUsername">{username}</h4>
       <button className="unbuttoned userInfoSettings fluentIcon">&#xf6b4;</button>
   </div>);
}

export default UserInfo;