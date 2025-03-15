import { match } from "path-to-regexp";
import { BlogArticle } from "../../blog/getArticles";
import getArticleCountPerPage from "../../config/getArticleCountPerPage";
import renderBlogPage from "../../frontend/renderPage";
import getPostsForPage from "../getPostsForPage";

const matchTag = match("/tag/:tag{/page/:page}");

const articleCountPerPage = getArticleCountPerPage();

export default async function tryRenderTaggedArticles(
  route: string,
  posts: BlogArticle[],
) {
  const tagPageMatch = matchTag(route);
  if (tagPageMatch) {
    const tag = tagPageMatch.params.tag as string;
    const taggedPosts = posts.filter((i) =>
      i.content.metadata.tags?.includes(tag),
    );
    const page = parseInt((tagPageMatch.params.page as string) ?? "1");
    const viewData = getPostsForPage(taggedPosts, page);

    return renderBlogPage({
      pageName: "tagged_articles",
      ...viewData,
      tag,
    });
  } else {
    return null;
  }
}
