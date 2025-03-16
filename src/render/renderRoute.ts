import { BlogPost } from "../blog/getPosts";
import tryRenderAllCategories from "./routes/allCategories";
import tryRenderAllPosts from "./routes/allPosts";
import tryRenderAllTags from "./routes/allTags";
import tryRenderCategoriedPosts from "./routes/categoriedPosts";
import tryRenderLicense from "./routes/license";
import tryRenderPost from "./routes/post";
import tryRenderTaggedPosts from "./routes/taggedPosts";

async function renderRoute(route: string, posts: BlogPost[]) {
  if (route === "/") return renderRoute("/page/1", posts);

  const rendered =
    (
      await Promise.all(
        [
          tryRenderAllPosts,
          tryRenderAllTags,
          tryRenderAllCategories,
          tryRenderCategoriedPosts,
          tryRenderTaggedPosts,
          tryRenderPost,
          tryRenderLicense,
        ].map((i) => i(route, posts))
      )
    ).filter((i) => !!i)[0] ?? null;

  if (rendered === null) throw new Error(`Unknown route: ${route}`);
  else return rendered;
}

export default function createRouteRenderer(posts: BlogPost[]) {
  return (route: string) => renderRoute(route, posts);
}
