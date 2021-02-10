import axios from '~/plugins/axios';
import { LIKECOIN_API, LIKECOIN_MISC_API_BASE } from '@/constant';

export const apiGetUserMinById = id => axios.get(`${LIKECOIN_API}/users/id/${id}/min`);

export const apiGetLikeButtonMyStatus = (id, {
  referrer = '',
  isCookieSupport,
  documentReferrer = '',
  sessionID = '',
  type = '',
}) => {
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.get(
    `${LIKECOIN_MISC_API_BASE}/like/likebutton/${id}/self?referrer=${encodeURIComponent(referrer)}${cookieParam}&show_count=0`,
    {
      headers: {
        'Document-Referrer': documentReferrer,
        'X-Likecoin-Button-Type': type,
        'X-Likecoin-Session-ID': sessionID,
      },
      withCredentials: true,
    },
  );
};

export const apiGetLikeButtonSelfCount = (id, referrer) => axios.get(
  `${LIKECOIN_MISC_API_BASE}/like/likebutton/${id}/self/like?referrer=${encodeURIComponent(referrer)}`,
  { withCredentials: true },
);

export const apiGetSuperLikeInfo = id => axios.get(`${LIKECOIN_MISC_API_BASE}/like/share/${id}`);

export const apiGetSuperLikeMyStatus = (tz = '', referrer = '') => axios.get(
  `${LIKECOIN_MISC_API_BASE}/like/share/self?tz=${tz}&referrer=${encodeURIComponent(referrer)}`,
  { withCredentials: true },
);

export const apiGetLikeButtonTotalCount = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/like/likebutton/${id}/total?referrer=${encodeURIComponent(referrer)}`);

export const apiGetLikeButtonLikerList = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/like/likebutton/${id}/list?referrer=${encodeURIComponent(referrer)}`);

export const apiPostLikeButton = (id, count = 1, {
  referrer = '',
  isCookieSupport,
  documentReferrer = '',
  sessionID = '',
  type = '',
}) => {
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.post(
    `${LIKECOIN_MISC_API_BASE}/like/likebutton/${id}/${count}?referrer=${encodeURIComponent(referrer)}${cookieParam}`,
    {},
    {
      headers: {
        'Document-Referrer': documentReferrer,
        'X-Likecoin-Button-Type': type,
        'X-Likecoin-Session-ID': sessionID,
      },
      withCredentials: true,
    },
  );
};
export const apiPostLikeButtonReadEvent = (id, {
  referrer = '',
  isCookieSupport,
  documentReferrer = '',
  sessionID = '',
  type = '',
}) => {
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.post(
    `${LIKECOIN_MISC_API_BASE}/like/likebutton/${id}/read?referrer=${encodeURIComponent(referrer)}${cookieParam}`,
    {},
    {
      headers: {
        'Document-Referrer': documentReferrer,
        'X-Likecoin-Button-Type': type,
        'X-Likecoin-Session-ID': sessionID,
      },
      withCredentials: true,
    },
  );
};

export const apiPostSuperLike = (id, {
  referrer = '',
  tz,
  parentSuperLikeID,
  documentReferrer = '',
  sessionID = '',
  type = '',
}) => axios.post(
  `${LIKECOIN_MISC_API_BASE}/like/share/${id}`,
  {
    referrer,
    tz,
    parentSuperLikeID,
  },
  {
    headers: {
      'Document-Referrer': documentReferrer,
      'X-Likecoin-Button-Type': type,
      'X-Likecoin-Session-ID': sessionID,
    },
    withCredentials: true,
  },
);

export const apiQueryCoinGeckoInfo = () => axios.get('https://api.coingecko.com/api/v3/coins/likecoin?localization=false', { withCredentials: false });

export const apiGetPageTitle = url => axios.get(`${LIKECOIN_MISC_API_BASE}/like/like/suggest/info/?url=${encodeURIComponent(url)}`)
  .then(res => (res.data || {}).title || '')
  .catch(() => '');

export const apiGetMyBookmark = (url = '') => axios.get(
  `${LIKECOIN_API}/users/bookmarks?url=${encodeURIComponent(url)}`,
  { withCredentials: true },
);

export const apiAddMyBookmark = (url = '', {
  documentReferrer = '',
  sessionID = '',
  type = '',
}) => axios.post(
  `${LIKECOIN_API}/users/bookmarks?url=${encodeURIComponent(url)}`,
  null,
  {
    headers: {
      'Document-Referrer': documentReferrer,
      'X-Likecoin-Button-Type': type,
      'X-Likecoin-Session-ID': sessionID,
    },
    withCredentials: true,
  },
);

export const apiDeleteMyBookmark = (id = '', {
  documentReferrer = '',
  sessionID = '',
  type = '',
}) => axios.delete(
  `${LIKECOIN_API}/users/bookmarks/${id}`,
  {
    headers: {
      'Document-Referrer': documentReferrer,
      'X-Likecoin-Button-Type': type,
      'X-Likecoin-Session-ID': sessionID,
    },
    withCredentials: true,
  },
);

export const apiGetMyFollower = (id = '') => axios.get(
  `${LIKECOIN_API}/users/follow/users/${id}`,
  { withCredentials: true },
);

export const apiAddMyFollower = (id = '', {
  documentReferrer = '',
  sessionID = '',
  type = '',
}) => axios.post(
  `${LIKECOIN_API}/users/follow/users/${id}`,
  null,
  {
    headers: {
      'Document-Referrer': documentReferrer,
      'X-Likecoin-Button-Type': type,
      'X-Likecoin-Session-ID': sessionID,
    },
    withCredentials: true,
  },
);

export const apiGetSupportingUserByID = (id = '') => axios.get(
  `${LIKECOIN_API}/civic/support/users/${id}`,
  { withCredentials: true },
);
