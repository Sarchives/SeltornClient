import { createRef, useState } from "react";

function LoginScreen(props: any) {
   const [register, setRegister] = useState(false);
   const [registered, setRegistered] = useState(false);

   const [email, setEmail] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const loginError = createRef<HTMLHeadingElement>();
   const registerError = createRef<HTMLHeadingElement>();

   if(!register) {
   return (<div className="loginScreen">
         <h1 className="loginTitle">Welcome back!</h1>
         <input type="text" placeholder="Email" className="loginInput" onChange={event => setEmail(event.target.value)} value={email}></input>
         <input type="password" placeholder="Password" className="loginInput" onChange={event => setPassword(event.target.value)} value={password}></input>
         <button className="loginButton" onClick={() => {
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
        loginError.current.style.visibility = 'visible';
     }
   })
         }}>Log in</button>
         <button className="loginButton" onClick={() => setRegister(true)}>Register</button>
         <h4 className="loginError" ref={loginError}>Something went wrong</h4>
   </div>);
   } else if(!registered) {
      return (<div className="loginScreen register">
         <h1 className="loginTitle">Welcome!</h1>
         <input type="text" placeholder="Email" className="loginInput" onChange={event => setEmail(event.target.value)} value={email}></input>
         <input type="text" placeholder="Username" className="loginInput" onChange={event => setUsername(event.target.value)} value={username}></input>
         <input type="password" placeholder="Password" className="loginInput" onChange={event => setPassword(event.target.value)} value={password}></input>
         <button className="loginButton" onClick={() => {
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
 .then(res => {
     if(res.status === 200) {
        setRegistered(true);
     } else if(registerError.current) {
      registerError.current.style.visibility = 'visible';
     }
   })
         }}>Register</button>
         <button className="loginButton" onClick={() => setRegister(false)}>Log in</button>
         <h4 className="loginError" ref={registerError}>Something went wrong</h4>
      </div>);
   } else {
      return (<div className="spinnerContainer">
      <div className="fluentIconBorder error">&#x001b;</div>
      <h2>Please check your inbox to verify your email.</h2>
   </div>)
   }
}

export default LoginScreen;