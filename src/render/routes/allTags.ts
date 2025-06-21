import { BlogPost } from "../../blog/getPosts";
import renderBlogPage from "../../frontend/renderPage";
import concat from "../../utils/concat";

export default async function tryRenderAllTags(
  route: string,
  posts: BlogPost[],
) {
  if (route === "/tags") {
    const tags = concat(posts.map(i => i.content.metadata.tags ?? [])).reduce(
      (pv, cv) => {
        if (!(cv in pv)) pv[cv] = 1;
        else pv[cv] += 1;

        return pv;
      },
      {} as { [key: string]: number },
    );
    return renderBlogPage({
      pageName: "tags",
      tags: Object.entries(tags).map(([name, count]) => ({ name, count })),
    });
  } else {
    return null;
  }
}
