import { useIntl } from "react-intl";

export default function useCurrentLang() {
  const intl = useIntl();

  return intl.locale;
}
