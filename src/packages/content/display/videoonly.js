const VideoOnly = (props) => {
  return (
    <video controls className={`${props.className} video-only`} style={{...props.style, maxWidth:"90%"}}>
    <source src={`${process.env.REACT_APP_FILES}${props.item?.url}`} />
  </video>
  );
};

export default VideoOnly;
