import MarkdownEditor from "@uiw/react-markdown-editor";
import useShareData from "../../../hooks/useshare";

const Link = (props) => {
  const { item, content, style, className } = props;

  const { Share, fileFromUrl } = useShareData(
    item?.title,
    item?.content,
    item?.url
  );

  if (!item) return <div>Loading</div>;

  return (
    <a href={item?.url}>{item.title}</a>
  );
};

export default Link;
