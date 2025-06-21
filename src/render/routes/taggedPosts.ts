import { match } from "path-to-regexp";
import { BlogPost } from "../../blog/getPosts";
import renderBlogPage from "../../frontend/renderPage";
import getPostsForPage from "../getPostsForPage";

const matchTag = match("/tag/:tag{/page/:page}");

export default async function tryRenderTaggedPosts(
  route: string,
  posts: BlogPost[],
) {
  const tagPageMatch = matchTag(route);
  if (tagPageMatch) {
    const tag = tagPageMatch.params.tag as string;
    const taggedPosts = posts.filter(i =>
      i.content.metadata.tags?.includes(tag),
    );
    const page = parseInt((tagPageMatch.params.page as string) ?? "1");
    const viewData = getPostsForPage(taggedPosts, page);

    return renderBlogPage({
      pageName: "tagged_posts",
      ...viewData,
      tag,
    });
  } else {
    return null;
  }
}
