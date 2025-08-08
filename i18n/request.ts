import {getRequestConfig} from 'next-intl/server';
export default getRequestConfig(async ({locale}) => {
  try {
    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default
    };
  } catch {
    return {
      locale: 'en',
      messages: (await import(`../messages/en.json`)).default
    };
  }
});
