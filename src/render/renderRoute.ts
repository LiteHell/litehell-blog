import { match } from "path-to-regexp";
import { BlogArticle } from "../blog/getArticles";
import getArticleCountPerPage from "../config/getArticleCountPerPage";
import tryRenderAllArticles from "./routes/allArticles";
import tryRenderAllCategories from "./routes/allCategories";
import tryRenderAllTags from "./routes/allTags";
import tryRenderCategoriedArticles from "./routes/categoriedArticles";
import tryRenderPost from "./routes/post";
import tryRenderTaggedArticles from "./routes/taggedArticles";

const matchPost = match("/post/:post_id");
const macthPage = match("/page/:page");
const matchCategory = match("/category/:category{/page/:page}");
const matchTag = match("/tag/:tag{/page/:page}");

const articleCountPerPage = getArticleCountPerPage();

async function renderRoute(route: string, posts: BlogArticle[]) {
  if (route === "/") return renderRoute("/page/1", posts);

  const rendered =
    (
      await Promise.all(
        [
          tryRenderAllArticles,
          tryRenderAllTags,
          tryRenderAllCategories,
          tryRenderCategoriedArticles,
          tryRenderTaggedArticles,
          tryRenderPost,
        ].map((i) => i(route, posts)),
      )
    ).filter((i) => !!i)[0] ?? null;

  if (rendered === null) throw new Error(`Unknown route: ${route}`);
  else return rendered;
}

export default function createRouteRenderer(posts: BlogArticle[]) {
  return (route: string) => renderRoute(route, posts);
}
