import PageCentered from "../parts/pagelayouts/pagecentered";
import ContentItem from "../packages/content/contentitem";

const ContentPage = ({id}) => {
  const customType = (content) => {
    if (content.type === "tickets") {
      return (
        <div>
          <h1>Tickets</h1>
        </div>
      );
    }
  };
  return (
    <PageCentered className="pagesContentPage">
      <h1>Content Page</h1>
      <div>
        <ContentItem id={id} style={{ maxWidth: "100%", padding: "0.5rem" }} customType={customType} />
      </div>
    </PageCentered>
  );
};

export default ContentPage;
