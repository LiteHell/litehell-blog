import finalhandler from "finalhandler";
import { watch } from "fs";
import http from "http";
import { tmpdir } from "os";
import path from "path";
import serveStatic from "serve-static";
import build from "../builder";

export default async function startDevServer(port: number) {
  const [blueDir, greenDir] = [
    path.join(tmpdir(), "litehell-blog-blue"), //await mkdtemp(path.join(tmpdir(), "litehell-blog-")),
    path.join(tmpdir(), "litehell-blog-green"), //await mkdtemp(path.join(tmpdir(), "litehell-blog-")),
  ];
  let servingNow: "blue" | "green" = "blue";

  const serveBlue = serveStatic(blueDir, {
    index: ["index.html"],
  });
  const serveGreen = serveStatic(greenDir, {
    index: ["index.html"],
  });

  console.log("Initially building...");
  await Promise.all([
    build(blueDir, { quite: true }),
    build(greenDir, { quite: true }),
  ]);
  console.log("Preparing watchers...");

  const switchBlueGreen = async () => {
    switch (servingNow) {
      case "blue":
        await build(greenDir, { quite: true });
        servingNow = "green";
        break;
      case "green":
        await build(blueDir, { quite: true });
        servingNow = "blue";
    }
    console.log(`Built at ${new Date().toLocaleString()}`);
  };

  watch("./posts", { recursive: true }, switchBlueGreen);
  watch("./drafts", { recursive: true }, switchBlueGreen);

  console.log("Watchers prepared");

  const server = http.createServer(function onRequest(req, res) {
    switch (servingNow) {
      case "blue":
        serveBlue(req, res, finalhandler(req, res));
        break;
      case "green":
        serveGreen(req, res, finalhandler(req, res));
    }
  });
  server.listen(port);

  console.log(`Listening on ${port}`);
}
