import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';

function Verify(props: any) {
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        fetch(props.domain + window.location.pathname, {
            method: 'POST'
          }).then(res => res.json()).then(result => {
              if(result.token) {
                localStorage.setItem("token", result.token);
                  window.location.pathname = '/app';
              } else {
                setFailed(true);
              }
          });
    }, []);

    if(!failed) {
   return (<LoadingScreen></LoadingScreen>);
    } else {
        return (<ErrorScreen error="Something went wrong while verifying your email."></ErrorScreen>);
    }
}

export default Verify;