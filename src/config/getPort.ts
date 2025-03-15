import findFreePorts, { isFreePort } from "find-free-ports";
import envConfigs from "./env";

export default async function getPort() {
  const portEnv = parseInt(envConfigs.PORT ?? "8000");
  let port = isNaN(portEnv) ? 8000 : portEnv;

  while (!isFreePort(port)) {
    port = (await findFreePorts())[0];
  }

  return port;
}
