export const convertToMarkdown = (text, terms = {"juzt.dance": "juztdance", "article": "text-event"} ) => {
    const termKeys = Object.keys(terms);
    const regex = new RegExp(`\\b(${termKeys.join('|')})\\b`, 'gi');
  
    return text.replace(regex, (matched) => {
      const className = terms[matched];
      return `\`[${matched}]{.${className}}\``;
    });
  }