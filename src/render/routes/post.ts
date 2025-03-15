import { match } from "path-to-regexp";
import { BlogArticle } from "../../blog/getArticles";
import renderBlogPage from "../../frontend/renderPage";

const matchPost = match("/post/:post_id");

export default async function tryRenderPost(
  route: string,
  posts: BlogArticle[],
) {
  const postMatch = matchPost(route);
  if (postMatch) {
    const postId = postMatch.params.post_id as string;
    const postIndex = posts.findIndex((i) => i.name === postId);
    const post = posts[postIndex],
      prevPostIndex = postIndex !== 0 ? postIndex - 1 : undefined,
      nextPostIndex =
        postIndex !== posts.length - 1 ? postIndex + 1 : undefined;

    return renderBlogPage({
      pageName: "post",
      post: {
        current: post,
        next: nextPostIndex ? posts[nextPostIndex] : undefined,
        previous: prevPostIndex ? posts[prevPostIndex] : undefined,
      },
    });
  } else {
    return null;
  }
}
