import { createRef, useState } from "react";

function LoginScreen(props: any) {
   const [register, setRegister] = useState(false);

   const [email, setEmail] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const loginError = createRef<HTMLHeadingElement>();
   const registerError = createRef<HTMLHeadingElement>();

   if(!register) {
   return (<div className="loginScreen">
      <div className="loginBanner">
         <h1>Welcome!</h1>
         <p>Register to connect with your friends</p>
         <button className="loginChanger" onClick={() => setRegister(true)}>Register</button>
      </div>
      <div className="loginItself">
         <h1 className="loginTitle">Welcome back!</h1>
         <input type="text" placeholder="Email" className="loginInput" onChange={event => setEmail(event.target.value)} value={email}></input>
         <input type="password" placeholder="Password" className="loginInput" onChange={event => setPassword(event.target.value)} value={password}></input>
         <button className="loginSubmit" onClick={() => {
fetch(props.domain + '/login', {
   method: 'POST',
   body: JSON.stringify({
      email: email,
      password: password
   }),
   headers: new Headers({
     'Content-Type': 'application/json'
   })
 })
 .then(res => res.json())
 .then(result => {
     if(result.token) {
        localStorage.setItem("token", result.token);
        window.location.reload();
     } else if(loginError.current) {
        loginError.current.style.display = 'inline-block';
     }
   })
         }}>Log in</button>
         <h4 className="loginError" ref={loginError}>Something went wrong</h4>
      </div>
   </div>);
   } else {
      return (<div className="loginScreen register">
      <div className="loginBanner">
         <h1>Welcome back!</h1>
         <p>Log in to re-connect with your friends</p>
         <button className="loginChanger" onClick={() => setRegister(false)}>Log in</button>
      </div>
      <div className="loginItself">
         <h1 className="loginTitle">Welcome!</h1>
         <input type="text" placeholder="Email" className="loginInput" onChange={event => setEmail(event.target.value)} value={email}></input>
         <input type="text" placeholder="Username" className="loginInput" onChange={event => setUsername(event.target.value)} value={username}></input>
         <input type="password" placeholder="Password" className="loginInput" onChange={event => setPassword(event.target.value)} value={password}></input>
         <button className="loginSubmit" onClick={() => {
fetch(props.domain + '/register', {
   method: 'POST',
   body: JSON.stringify({
      email: email,
      username: username,
      password: password
   }),
   headers: new Headers({
     'Content-Type': 'application/json'
   })
 })
 .then(res => res.json())
 .then(result => {
     if(result.token) {
        localStorage.setItem("token", result.token);
        window.location.reload();
     } else if(registerError.current) {
      registerError.current.style.display = 'inline-block';
     }
   })
         }}>Register</button>
         <h4 className="loginError" ref={registerError}>Something went wrong</h4>
      </div>
   </div>);
   }
}

export default LoginScreen;