import { match } from "path-to-regexp";
import { BlogPost } from "../../blog/getPosts";
import renderBlogPage from "../../frontend/renderPage";
import getPostsForPage from "../getPostsForPage";

const macthPage = match("/page/:page");

export default async function tryRenderAllPosts(
  route: string,
  posts: BlogPost[],
) {
  const postPageMatch = macthPage(route);
  if (postPageMatch) {
    const page = parseInt((postPageMatch.params.page as string) ?? "1");
    const viewData = getPostsForPage(posts, page);
    return renderBlogPage({
      pageName: "all_posts",
      ...viewData,
    });
  } else {
    return null;
  }
}
