import { combineUrlAndPath } from "../../../functions/combineurlandpath";
import useShareData from "../../../hooks/useshare";

const VideoDescription = (props) => {
  const { item, style, className } = props;

  const { Share, fileFromUrl } = useShareData(
    item?.title,
    item?.content,
    item?.url
  );

  if (!item) return <div>Loading</div>;

  return (
    <div className={`${className} video-description`} style={style}>
      <video
        controls
        className={props.className}
        style={{ ...props.style, maxWidth: "90%" }}
      >
        <source src={combineUrlAndPath(process.env.REACT_APP_FILES`${props.item?.url}`)} />
      </video>
      <h3>{item.title}</h3>
      <div>{item.content}</div>
    </div>
  );
};

export default VideoDescription;
