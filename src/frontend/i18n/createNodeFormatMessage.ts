import { createIntl, createIntlCache } from "@formatjs/intl";
import getLangData from "./getLangData";
import getDefaultLang from "./getDefaultLang";

export type NodeFormatMessageFunction = (id: string, params?: any) => string;
export default async function createNodeFormatMessage(lang: string) {
  const messages = await getLangData(lang);
  const defaultLocale = getDefaultLang();

  const cache = createIntlCache();
  const intl = createIntl(
    {
      locale: lang,
      defaultLocale,
      messages,
    },
    cache,
  );

  return ((id: string, params?: any) => {
    return intl.formatMessage(
      {
        id,
      },
      params,
    );
  }) as NodeFormatMessageFunction;
}
