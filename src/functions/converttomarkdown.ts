type TermMap = Record<string, string>;

export const convertToMarkdown = (
  text: string,
  terms: TermMap = { "juzt.dance": "juztdance", article: "text-event" }
): string => {
  const termKeys = Object.keys(terms);
  const regex = new RegExp(`\\b(${termKeys.join("|")})\\b`, "gi");

  return text.replace(regex, (matched) => {
    const className = terms[matched];
    return `\`[${matched}]{.${className}}\``;
  });
};
