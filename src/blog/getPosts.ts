import getPostNames from "./getPostNames";
import parseMarkdown from "./parseMarkdown";
import parsePostMetadata, {
  BlogMarkdownSourceAndMetadata,
} from "./parsePostMetadata";
import readPostSource from "./readPostSource";

export type BlogPostContent = {
  parsed: string;
} & BlogMarkdownSourceAndMetadata;

export type BlogPost = {
  draft: boolean;
  name: string;
  content: BlogPostContent;
};

export default async function getPosts({ includeDrafts = false } = {}): Promise<
  BlogPost[]
> {
  const drafts = includeDrafts
    ? await getPostNames("drafts")
    : ([] as string[]);
  const published = await getPostNames("published");

  const parse = async (names: string[], draft: boolean) =>
    await Promise.all(
      names.map(async (name) => {
        const sourceWithMetadata = await readPostSource({ name, draft });
        const metadataAndSource = await parsePostMetadata(sourceWithMetadata);
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
