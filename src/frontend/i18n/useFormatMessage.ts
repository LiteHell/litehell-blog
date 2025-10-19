import { useIntl } from "react-intl";

export default function useFormatMessage() {
  const intl = useIntl();

  return (id: string, params?: Record<string, any>) => {
    return intl.formatMessage({ id }, params);
  };
}
