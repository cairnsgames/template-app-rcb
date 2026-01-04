import Reviews from "../packages/reviews/reviews";
import Rating from "../packages/reviews/rating";
import PageCentered from "../parts/pagelayouts/pagecentered";

const ReviewPage = (props) => {
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
    <PageCentered style={{ margin: "1rem" }} className="pagesReviewPage">
      <div style={{ position: "relative" }}>
        <h1>HEADER</h1>
        <div style={{ position: "absolute", top: "0px", right: "0px" }}>
          <Rating type="test" id="1" />
        </div>
        <Reviews type="test" id="1" />
      </div>
    </PageCentered>
  );
};

export default ReviewPage;
