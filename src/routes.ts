import { BlogArticle, BlogArticleContent } from "./blog/getArticles";
import getArticleCountPerPage from "./config/getArticleCountPerPage";
import range from "./utils/range";
import concat from "./utils/concat";
import unique from "./utils/unique";

const articleCountPerPage = getArticleCountPerPage();
function getTagRoutes(posts: BlogArticle[]) {
  const contents = posts.map((i) => i.content);
  const tags = unique(concat(contents.map((i) => i.metadata.tags ?? [])));
  let result: string[] = [];

  for (const tag of tags) {
    const totalPages = Math.ceil(
      contents.filter((i) => i.metadata.tags?.includes(tag)).length /
        articleCountPerPage,
    );
    result = result.concat([
      `/tag/${encodeURIComponent(tag)}`,
      ...range(1, totalPages).map(
        (i) => `/tag/${encodeURIComponent(tag)}/page/${i}`,
      ),
    ]);
  }

  return result;
}

function getCategoryRoutes(posts: BlogArticle[]) {
  const contents = posts.map((i) => i.content);
  const categories = unique(
    contents
      .filter((i) => !!i.metadata.category)
      .map((i) => i.metadata.category),
  ) as string[];
  let result: string[] = [];

  for (const category of categories) {
    const totalPages = Math.ceil(
      contents.filter((i) => i.metadata.category?.includes(category)).length /
        articleCountPerPage,
    );
    result = result.concat([
      `/category/${encodeURIComponent(category)}`,
      ...range(1, totalPages).map(
        (i) => `/category/${encodeURIComponent(category)}/page/${i}`,
      ),
    ]);
  }

  return result;
}

export default async function getRoutes(posts: BlogArticle[]) {
  const totalPages = Math.ceil(posts.length / articleCountPerPage);

  return [
    "/",
    "/tags",
    "/categories",
    ...range(1, totalPages).map((i) => `/page/${i}`),
    ...posts.map((i) => i.name).map((i) => `/post/${encodeURIComponent(i)}`),
    ...getTagRoutes(posts),
    ...getCategoryRoutes(posts),
  ];
}
