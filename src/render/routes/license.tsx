import renderBlogPage from "../../frontend/renderPage";

export default function tryRenderLicense(route: string) {
  if (route === "/license")
    return renderBlogPage({
      pageName: "license",
    });
  else return null;
}
