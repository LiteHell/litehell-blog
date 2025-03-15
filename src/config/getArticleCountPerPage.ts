import envConfigs from "./env";

export default function getArticleCountPerPage(defaultValue = 15) {
  const parsed = parseInt(envConfigs.ARTICLE_COUNT_PER_PAGE);

  return isNaN(parsed) ? defaultValue : parsed;
}
