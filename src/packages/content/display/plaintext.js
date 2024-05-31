import useShareData from "../../../hooks/useshare";

const PlainText = (props) => {
  const { item, style, className } = props;
  
  const { Share, fileFromUrl } = useShareData(item?.title, item?.content, item?.url);

  if (!item) return <div>Loading</div>;

  return (
    <div className={`${className} plain-text`} style={{...style, maxWidth:"100%"}}>
    <h3>
      {item.title}
      <Share item={{...item, files: [fileFromUrl(item.url)]}} className="float-end" />
    </h3>
    <div>{item.content}</div>
  </div>
  );
};

export default PlainText;
