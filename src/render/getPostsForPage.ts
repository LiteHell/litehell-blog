import { BlogPost } from "../blog/getPosts";
import getPostCountPerPage from "../config/getPostCountPerPage";

const postCountPerPage = getPostCountPerPage();

export function getTotalPages(posts: BlogPost[]) {
  return Math.ceil(posts.length / postCountPerPage);
}

export default function getPostsForPage(posts: BlogPost[], page: number) {
  const totalPages = getTotalPages(posts);
  const postsForPage = posts.slice(
    postCountPerPage * (page - 1),
    postCountPerPage * page,
  );
  return {
    posts: postsForPage,
    navigation: {
      total: totalPages,
      current: page,
    },
  };
}
