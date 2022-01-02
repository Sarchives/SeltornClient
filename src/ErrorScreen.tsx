function LoadingScreen(props: any) {
   return (<div className="spinnerContainer">
      <div className="fluentIconBorder error">&#xf3f2;</div>
      {props.error ? <h2>{props.error}</h2> : <h2>Something went wrong.</h2>}
   </div>);
}

export default LoadingScreen;