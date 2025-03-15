import getArticleNames from "./getArticleNames";
import parseMarkdown from "./parseMarkdown";
import parseArticleMetadata, {
  BlogMarkdownSourceAndMetadata,
} from "./parseArticleMetadata";
import readArticleSource from "./readArticleSource";

export type BlogArticleContent = {
  parsed: string;
} & BlogMarkdownSourceAndMetadata;

export type BlogArticle = {
  draft: boolean;
  name: string;
  content: BlogArticleContent;
};

export default async function getArticles({
  includeDrafts = false,
} = {}): Promise<BlogArticle[]> {
  const drafts = includeDrafts
    ? await getArticleNames("drafts")
    : ([] as string[]);
  const published = await getArticleNames("published");

  const parse = async (names: string[], draft: boolean) =>
    await Promise.all(
      names.map(async (name) => {
        const sourceWithMetadata = await readArticleSource({ name, draft });
        const metadataAndSource =
          await parseArticleMetadata(sourceWithMetadata);
        return {
          content: {
            ...metadataAndSource,
            parsed: await parseMarkdown(
              metadataAndSource.sourceWithoutMetadata,
            ),
          },
          draft,
          name,
        };
      }),
    );

  return [...(await parse(drafts, true)), ...(await parse(published, false))];
}
