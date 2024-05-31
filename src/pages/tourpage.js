import PageFull from "../parts/pagelayouts/pagefull";
import ContentItem from "../packages/content/contentitem";

const TourPage = (props) => {
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
    <PageFull style={{ padding: "1rem" }}>
      <div style={{ position: "relative" }}>
        <ContentItem id={16} customType={customType} />
      </div>
    </PageFull>
  );
};

export default TourPage;
