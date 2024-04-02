import PageWrapper from "../../parts/pagewrapper";
import ContentItem from "../../packages/content/components/contentitem";

const ContentPage = ({id}) => {
  return (
    <PageWrapper>
      <h1>Content Page</h1>
      <div style={{border: "2px solid green", borderRadius: "2rem"}}>
        <ContentItem id={id} style={{ maxWidth: "100%", padding: "0.5rem" }} />
      </div>
    </PageWrapper>
  );
};

export default ContentPage;
