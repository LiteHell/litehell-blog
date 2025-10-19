import { watch } from "fs";
import express from "express";
import createRouteRenderer, {
  RouteRenderer,
  UnknownRouteError,
} from "../render/renderRoute";
import getPosts from "../blog/getPosts";

async function getPostsWithDraft() {
  return (
    await getPosts({
      includeDrafts: true,
      preferredLang: process.env.BLOG_LANG,
    })
  ).sort(
    (a, b) =>
      Date.parse(b.content.metadata.date ?? "") -
      Date.parse(a.content.metadata.date ?? ""),
  );
}

function createReloadPost(onRendererCreate: (renderer: RouteRenderer) => void) {
  let timeoutId: NodeJS.Timeout | null = null;

  return () => {
    if (timeoutId !== null) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      console.log("Reloading posts....");
      getPostsWithDraft().then(posts =>
        onRendererCreate(createRouteRenderer(posts)),
      );
      console.log("Done reloading posts");
    }, 500);
  };
}

export default async function startDevServer(port: number) {
  console.log("NOTE: dev sever doesn't work on feed routes");
  console.log("Creating renderer....");
  let renderRoute: RouteRenderer = createRouteRenderer(
    await getPostsWithDraft(),
  );
  console.log("Created");
  let reloadedTime = Date.now();
  const reloadPost = createReloadPost(newRenderer => {
    reloadedTime = Date.now();
    renderRoute = newRenderer;
  });

  watch("./posts", { recursive: true }, reloadPost);
  watch("./drafts", { recursive: true }, reloadPost);

  const app = express();
  app.get(
    "/__dev__server__",
    (req, _res, next) => {
      const cur = parseInt((req.query.cur as string) ?? "0");
      if (cur !== 0) {
        let delayResponseUntilReload = () => {
          if (cur === reloadedTime) setTimeout(delayResponseUntilReload, 100);
          else next();
        };
        delayResponseUntilReload();
      } else {
        next();
      }
    },
    (_req, res) => {
      res.type("application/json").end(JSON.stringify(reloadedTime));
    },
  );
  app.use(express.static("./public"));
  app.use("/post", express.static("./posts"));
  app.use("/post", express.static("./drafts"));

  app.use((req, res, next) => {
    renderRoute(req.path)
      .then(rendered => {
        if (!req.path.endsWith("/")) {
          return res.redirect(301, req.path + "/");
        }

        res.type("text/html");
        res.end(
          rendered +
            `<script>
        (function(){
          let __dev_time=${reloadedTime};
          const checkNextBuild = (async function() {
            try {
              const newTimeRes = await fetch('/__dev__server__?cur=' + __dev_time);
              const newTime = await newTimeRes.json();
              if (newTime !== __dev_time)
                location.reload();
            } catch (err) {
              // Do nothing
            } finally {
              setTimeout(checkNextBuild, 50);
            }
          });
          checkNextBuild();
        })();
        </script>`,
        );
      })
      .catch(err => {
        if (err instanceof UnknownRouteError) {
          next();
        } else {
          next(err);
        }
      });
  });
  app.listen(port);

  console.log(`Listening on ${port}`);
}
