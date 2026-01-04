import React from "react";
import PageFull from "../parts/pagelayouts/pagefull";
import TranslationSummary from "../packages/translation/summary";

const TranslationPage = (props) => {
  return (
    <PageFull className="pagesTranslationPage">
      <div style={{ position: "relative" }}>
        <h1>TRANSLATION EXAMPLE</h1>
          <TranslationSummary />
      </div>
    </PageFull>
  );
};

export default TranslationPage;
