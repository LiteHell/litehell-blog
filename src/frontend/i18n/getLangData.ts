export default async function getLangData(lang: string) {
  return (await import(`./messages/${lang}.json`)) as Record<string, string>;
}
