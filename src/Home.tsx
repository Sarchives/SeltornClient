import { useEffect } from 'react';
import logo from './logo.png';

function Home(props: any) {
    useEffect(() => {
        document.body.children[1].classList.add('overflowAuto');
        return () => {
            document.body.children[1].classList.remove('overflowAuto');
        };
    }, []);

   return (<>
       <div className="homeMenu">
       <img src={logo} alt="Seltorn" className="homeLogo"></img>
       <h2>Seltorn</h2>
       <a href="/app" className="homeMenuLink"><h2>Open</h2></a>
       </div>
       <div className="homeContent">
       <h1>Let's chat...</h1>
       <h4 className="homeDescription homeImportantDescription">Seltorn is an easy to use chat platform, that promises to be privacy-friendly and open.</h4>
       <h2>Features</h2>
       <div className="homeFeature">
           <span className="fluentIconBorder homeFeatureIcon">&#xf504;</span>
           <div>
               <h2>Safe</h2>
               <h4 className="homeDescription">We make it easy to protect yourself from malicious people thanks to our report feature. In addition to that, we offer several moderation tools so server mods can enforce their own rules easily.</h4>
           </div>
       </div>
       <div className="homeFeature">
           <span className="fluentIconBorder homeFeatureIcon">&#x01f5;</span>
           <div>
               <h2>Easy to use</h2>
               <h4 className="homeDescription">We don't want our users to have issues using our platform, so we offer a familiar design that will help you to get started.</h4>
           </div>
       </div>
       <div className="homeFeature">
           <span className="fluentIconBorder homeFeatureIcon">&#xf593;</span>
           <div>
               <h2>Customizable</h2>
               <h4 className="homeDescription">Some chat platforms don't have options to let their users feel at home design-wise, but we offer themes. Feel free to try them below!</h4>
<div className="homeThemeContainer">
    <button className="homeTheme homeThemeRed" disabled={props.theme === 'red'} onClick={() => props.setTheme('red')}><span></span></button>
    <button className="homeTheme homeThemePink" disabled={props.theme === 'pink'} onClick={() => props.setTheme('pink')}><span></span></button>
    <button className="homeTheme homeThemePurple" disabled={props.theme === 'purple'} onClick={() => props.setTheme('purple')}><span></span></button>
    <button className="homeTheme homeThemeDeepPurple" disabled={props.theme === 'deepPurple'} onClick={() => props.setTheme('deepPurple')}><span></span></button>
    <button className="homeTheme homeThemeIndigo" disabled={props.theme === 'indigo'} onClick={() => props.setTheme('indigo')}><span></span></button>
    <button className="homeTheme homeThemeBlue" disabled={props.theme === 'blue'} onClick={() => props.setTheme('blue')}><span></span></button>
    <button className="homeTheme homeThemeLightBlue" disabled={props.theme === 'lightBlue'} onClick={() => props.setTheme('lightBlue')}><span></span></button>
    <button className="homeTheme homeThemeCyan" disabled={props.theme === 'cyan'} onClick={() => props.setTheme('cyan')}><span></span></button>
    <button className="homeTheme homeThemeTeal" disabled={props.theme === 'teal'} onClick={() => props.setTheme('teal')}><span></span></button>
    <button className="homeTheme homeThemeGreen" disabled={props.theme === 'green'} onClick={() => props.setTheme('green')}><span></span></button>
    <button className="homeTheme homeThemeLightGreen" disabled={props.theme === 'lightGreen'} onClick={() => props.setTheme('lightGreen')}><span></span></button>
    <button className="homeTheme homeThemeLime" disabled={props.theme === 'lime'} onClick={() => props.setTheme('lime')}><span></span></button>
    <button className="homeTheme homeThemeYellow" disabled={props.theme === 'yellow'} onClick={() => props.setTheme('yellow')}><span></span></button>
    <button className="homeTheme homeThemeAmber" disabled={props.theme === 'amber'} onClick={() => props.setTheme('amber')}><span></span></button>
    <button className="homeTheme homeThemeOrange" disabled={props.theme === 'orange'} onClick={() => props.setTheme('orange')}><span></span></button>
    <button className="homeTheme homeThemeDeepOrange" disabled={props.theme === 'deepOrange'} onClick={() => props.setTheme('deepOrange')}><span></span></button>
    <button className="homeTheme homeThemeBrown" disabled={props.theme === 'brown'} onClick={() => props.setTheme('brown')}><span></span></button>
    <button className="homeTheme homeThemeGrey" disabled={props.theme === 'grey'} onClick={() => props.setTheme('grey')}><span></span></button>
    <button className="homeTheme homeThemeBlueGrey" disabled={props.theme === 'blueGrey'} onClick={() => props.setTheme('blueGrey')}><span></span></button>

</div>
           </div>
       </div>
       <div className="homeFeature">
           <span className="fluentIconBorder homeFeatureIcon">&#x00c1;</span>
           <div>
               <h2>Open</h2>
               <h4 className="homeDescription">We are open source, and so we have the advantage of being open. We not only accept contributions to our GitHub, but you can make custom clients or modify ours to your liking.</h4>
           </div>
       </div>
       </div>
   </>);
}

export default Home;