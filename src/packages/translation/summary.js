import useTranslation from "../translation/usetranslation";

const TranslationSummary = (props) => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>Default</h1>
      <p>{t("summary")}</p>
      <p>{t("summaryText")}</p>
      <h1> AF Translation</h1>
      <p>{t("summary", "af")}</p>
      <p>{t("summaryText", "af")}</p>

    </div>
  );
};

export default TranslationSummary;
