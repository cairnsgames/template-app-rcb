import React from 'react';

const HighlightText = ({ text, terms = {"juzt.dance": "juztdance", "article": "text-primary"} }) => {
  const highlightTerms = (text, terms) => {
    // Sort terms by length in descending order to avoid partial matches
    const sortedTerms = Object.keys(terms).sort((a, b) => b.length - a.length);

    // Create a regex pattern for all terms
    const pattern = new RegExp(`(${sortedTerms.join('|')})`, 'gi');

    // Split the text by the pattern and map each part
    return text.split(pattern).map((part, index) => {
      // Check if the part matches any term and apply the appropriate class
      const term = sortedTerms.find(t => t.toLowerCase() === part.toLowerCase());
      return term ? (
        <span key={`${term}-${index}`} className={terms[term]}>
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  const formattedText = highlightTerms(text, terms);

  return <>{formattedText}</>;
};

export default HighlightText;
