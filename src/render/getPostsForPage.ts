import { BlogArticle } from "../blog/getArticles";
import getArticleCountPerPage from "../config/getArticleCountPerPage";

const articleCountPerPage = getArticleCountPerPage();

export function getTotalPages(posts: BlogArticle[]) {
  return Math.ceil(posts.length / articleCountPerPage);
}

export default function getPostsForPage(posts: BlogArticle[], page: number) {
  const totalPages = getTotalPages(posts);
  const postsForPage = posts.slice(
    articleCountPerPage * (page - 1),
    articleCountPerPage * page,
  );
  return {
    posts: postsForPage,
    navigation: {
      total: totalPages,
      current: page,
    },
  };
}
