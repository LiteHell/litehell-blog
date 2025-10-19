import createNodeFormatMessage from "../frontend/i18n/createNodeFormatMessage";
import getPostNames from "./getPostNames";
import parseMarkdown from "./parseMarkdown";
import parsePostMetadata, {
  BlogMarkdownSourceAndMetadata,
} from "./parsePostMetadata";
import readPostSource, { PostSource } from "./readPostSource";

export type BlogPostContent = {
  parsed: string;
  translated?: boolean;
  lang: string;
} & BlogMarkdownSourceAndMetadata;

export type BlogPost = {
  draft: boolean;
  name: string;
  content: BlogPostContent;
};

export default async function getPosts({
  includeDrafts = false,
  preferredLang = "ko",
} = {}): Promise<BlogPost[]> {
  const drafts = includeDrafts
    ? await getPostNames("drafts")
    : ([] as string[]);
  const published = await getPostNames("published");
  const formatMessage = await createNodeFormatMessage(
    preferredLang ?? process.env.BLOG_LANG ?? "ko",
  );

  const parse = async (names: string[], draft: boolean) =>
    await Promise.all(
      names.map(async name => {
        const rawSources = await readPostSource({ name, draft });
        const listOfMetadataAndSource = await Promise.all(
          rawSources.map(async i => ({
            ...i,
            ...(await parsePostMetadata(i.rawSource)),
          })),
        );

        const metadataAndSource = ((preferredLang
          ? listOfMetadataAndSource.find(i => i.lang === preferredLang)
          : null) ??
          listOfMetadataAndSource
            .filter(i => !i.metadata.translated_at)
            .reduce(
              (pv, cv) => {
                if (pv === null) return cv;
                else if (
                  Date.parse(pv.metadata.date!) > Date.parse(cv.metadata.date!)
                )
                  return cv;
                else return pv;
              },
              null as null | (BlogMarkdownSourceAndMetadata & PostSource),
            ))!;

        const translated = preferredLang
          ? !!metadataAndSource.metadata.translated_at
          : false;

        return {
          content: {
            ...metadataAndSource,
            translated,
            parsed: await parseMarkdown(
              metadataAndSource.sourceWithoutMetadata,
              { footnoteLabel: formatMessage("post.footnoteLabel") },
            ),
          },
          draft,
          name,
        };
      }),
    );

  return [...(await parse(drafts, true)), ...(await parse(published, false))];
}
