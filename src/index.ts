import build from "./builder";
import envConfigs from "./config/env";
import getPort from "./config/getPort";
import startDevServer from "./server/devServer";

async function main() {
  if (process.argv.includes("--watch")) {
    const port = await getPort();
    startDevServer(port);
  } else if (process.argv.includes("--build")) {
    const outDir = envConfigs.OUTPUT_DIR;
    build(outDir).then(() => console.log("Done"));
  } else {
    console.log("LiteHell's blog builder");
    console.log("");
    console.log("  --watch");
    console.log("    runs a server, which rebuilds on change");
    console.log("    If port is in use, the new unused port will be used");
    console.log(
      "    (default port: 8000, can be changed with PORT environment variable)",
    );
    console.log("");
    console.log("  --build");
    console.log("     build to directory");
    console.log(
      "     default output directory: out, can be changed with OUTPUT_DIR environment variable)",
    );
    console.log(
      "     Please do not use `dist` for output directory because it's used for js build",
    );
  }
}

main();
