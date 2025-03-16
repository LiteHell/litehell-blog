const envConfigs = {
  PORT: process.env.PORT ?? "8000",
  OUTPUT_DIR: process.env.OUTPUT_DIR ?? "./out",
  POST_COUNT_PER_PAGE:
    process.env.POST_COUNT_PER_PAGE ??
    process.env.ARTICLE_COUNT_PER_PAGE ??
    "10",
};

export default envConfigs;
