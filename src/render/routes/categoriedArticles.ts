import { match } from "path-to-regexp";
import { BlogArticle } from "../../blog/getArticles";
import renderBlogPage from "../../frontend/renderPage";
import getPostsForPage from "../getPostsForPage";

const matchCategory = match("/category/:category{/page/:page}");

export default async function tryRenderCategoriedArticles(
  route: string,
  posts: BlogArticle[],
) {
  const categoryPageMatch = matchCategory(route);
  if (categoryPageMatch) {
    const category = categoryPageMatch.params.category as string;
    const categoriedPosts = posts.filter(
      (i) => i.content.metadata.category === category,
    );
    const page = parseInt((categoryPageMatch.params.page as string) ?? "1");
    const viewData = getPostsForPage(categoriedPosts, page);
    return renderBlogPage({
      pageName: "categoried_articles",
      ...viewData,
      category,
    });
  } else {
    return null;
  }
}
