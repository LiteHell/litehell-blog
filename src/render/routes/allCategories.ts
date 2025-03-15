import { BlogArticle } from "../../blog/getArticles";
import renderBlogPage from "../../frontend/renderPage";

export default async function tryRenderAllCategories(
  route: string,
  posts: BlogArticle[],
) {
  if (route === "/categories") {
    const tags = posts
      .map((i) => i.content.metadata.category ?? null)
      .filter((i) => i !== null)
      .reduce(
        (pv, cv) => {
          if (!(cv in pv)) pv[cv] = 1;
          else pv[cv] += 1;

          return pv;
        },
        {} as { [key: string]: number },
      );
    return renderBlogPage({
      pageName: "categories",
      categories: Object.entries(tags).map(([name, count]) => ({
        name,
        count,
      })),
    });
  } else {
    return null;
  }
}
