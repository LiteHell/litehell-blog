import envConfigs from "./env";

export default function getPostCountPerPage(defaultValue = 15) {
  const parsed = parseInt(envConfigs.POST_COUNT_PER_PAGE);

  return isNaN(parsed) ? defaultValue : parsed;
}
