import PageFull from "../parts/pagelayouts/pagefull";
import ContentDisplay from "../packages/content/contentdisplay";
import useUser from "../packages/auth/context/useuser";

const NewContentPage = (props) => {
  const { user } = useUser();
  return (
    <PageFull className="pagesNewContentPage">
      <h1>New Content</h1>
      <div style={{ position: "relative" }}>
        {user && (
          <ContentDisplay
            item={{
              type: 8,
              user_id: user?.id,
              title: "New Image",
              content: "",
            }}
          />
        )}
      </div>
    </PageFull>
  );
};

export default NewContentPage;
