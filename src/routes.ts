import { BlogPost } from "./blog/getPosts";
import getPostCountPerPage from "./config/getPostCountPerPage";
import concat from "./utils/concat";
import range from "./utils/range";
import unique from "./utils/unique";

const postCountPerPage = getPostCountPerPage();
function getTagRoutes(posts: BlogPost[]) {
  const contents = posts.map((i) => i.content);
  const tags = unique(concat(contents.map((i) => i.metadata.tags ?? [])));
  let result: string[] = [];

  for (const tag of tags) {
    const totalPages = Math.ceil(
      contents.filter((i) => i.metadata.tags?.includes(tag)).length /
        postCountPerPage,
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

function getCategoryRoutes(posts: BlogPost[]) {
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
        postCountPerPage,
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

export default async function getRoutes(posts: BlogPost[]) {
  const totalPages = Math.ceil(posts.length / postCountPerPage);

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
