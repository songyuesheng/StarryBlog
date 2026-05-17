import { getRequestURL, proxyRequest } from 'h3';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const publicApiUrl = config.public.apiUrl as string;
  const publicAbsoluteApiUrl = /^https?:\/\//.test(publicApiUrl) ? publicApiUrl : '';
  const upstreamBaseUrl = (config.apiInternalUrl || publicAbsoluteApiUrl) as string;

  if (!upstreamBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing API upstream configuration',
    });
  }

  const targetBaseUrl = upstreamBaseUrl.replace(/\/+$/, '');
  const path = event.context.params?.path || '';
  const search = getRequestURL(event).search;

  return proxyRequest(event, `${targetBaseUrl}/${path}${search}`);
});
