import { match } from "path-to-regexp";
import { BlogArticle } from "../../blog/getArticles";
import renderBlogPage from "../../frontend/renderPage";
import getPostsForPage from "../getPostsForPage";

const macthPage = match("/page/:page");

export default async function tryRenderAllArticles(
  route: string,
  posts: BlogArticle[],
) {
  const postPageMatch = macthPage(route);
  if (postPageMatch) {
    const page = parseInt((postPageMatch.params.page as string) ?? "1");
    const viewData = getPostsForPage(posts, page);
    return renderBlogPage({
      pageName: "all_articles",
      ...viewData,
    });
  } else {
    return null;
  }
}
