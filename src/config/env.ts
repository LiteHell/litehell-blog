const envConfigs = {
  PORT: process.env.PORT ?? "8000",
  OUTPUT_DIR: process.env.OUTPUT_DIR ?? "./out",
  ARTICLE_COUNT_PER_PAGE: "10",
};

export default envConfigs;
