import yaml from "js-yaml";

export type BlogPostMetadata = Partial<{
  title: string;
  subtitle: string;
  author: string;
  date: string;
  series: string;
  seriesName: string;
  category: string;
  tags: string[];
  last_modified_at: string;
}>;

export type BlogMarkdownSourceAndMetadata = {
  metadata: BlogPostMetadata;
  sourceWithoutMetadata: string;
};

export default function parsePostMetadata(
  source: string,
): BlogMarkdownSourceAndMetadata {
  if (!source.startsWith("---\n")) {
    return {
      metadata: {},
      sourceWithoutMetadata: source,
    };
  }

  const metadataYamlEndsAt = source.indexOf("---\n", 4);
  const metadataYaml = source.substring(4, metadataYamlEndsAt);

  return {
    metadata: yaml.load(metadataYaml) as BlogPostMetadata,
    sourceWithoutMetadata: source.substring(metadataYamlEndsAt + 4),
  };
}
