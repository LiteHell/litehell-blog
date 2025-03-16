import { match } from "path-to-regexp";
import { BlogPost } from "../../blog/getPosts";
import renderBlogPage from "../../frontend/renderPage";
import getPostsForPage from "../getPostsForPage";

const matchCategory = match("/category/:category{/page/:page}");

export default async function tryRenderCategoriedPosts(
  route: string,
  posts: BlogPost[],
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
      pageName: "categoried_posts",
      ...viewData,
      category,
    });
  } else {
    return null;
  }
}
