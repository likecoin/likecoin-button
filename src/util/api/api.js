import axios from '~/plugins/axios';
import { LIKECOIN_API, LIKECOIN_MISC_API_BASE, ISCN_RAW_DATA_ENDPOINT } from '@/constant';

function getLikeCoinButtonHeaders({
  documentReferrer = '',
  sessionID = '',
  type = '',
  integration = '',
}) {
  return {
    'Document-Referrer': documentReferrer,
    'X-Likecoin-Button-Type': type,
    'X-Likecoin-Session-ID': sessionID,
    'X-Likecoin-Button-Integration': integration,
  };
}

export const apiGetUserMinById = id => axios.get(`${LIKECOIN_API}/users/id/${id}/min`);

export const apiGetLikeButtonMyStatus = (id, data) => {
  const {
    referrer = '',
    isCookieSupport,
  } = data;
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.get(
    `${LIKECOIN_MISC_API_BASE}/like/likebutton/${id}/self?referrer=${encodeURIComponent(referrer)}${cookieParam}&show_count=0`,
    {
      headers: getLikeCoinButtonHeaders(data),
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

export const apiPostLikeButton = (id, count = 1, data) => {
  const {
    referrer = '',
    isCookieSupport,
  } = data;
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.post(
    `${LIKECOIN_MISC_API_BASE}/like/likebutton/${id}/${count}?referrer=${encodeURIComponent(referrer)}${cookieParam}`,
    {},
    {
      headers: getLikeCoinButtonHeaders(data),
      withCredentials: true,
    },
  );
};

export const apiPostSuperLike = (id, data) => {
  const {
    referrer = '',
    tz,
    parentSuperLikeID,
  } = data;
  return axios.post(
    `${LIKECOIN_MISC_API_BASE}/like/share/${id}`,
    {
      referrer,
      tz,
      parentSuperLikeID,
    },
    {
      headers: getLikeCoinButtonHeaders(data),
      withCredentials: true,
    },
  );
};

export const apiQueryCoinGeckoInfo = () => axios.get('https://api.coingecko.com/api/v3/coins/likecoin?localization=false', { withCredentials: false });

export const apiGetPageTitle = url => axios.get(`${LIKECOIN_MISC_API_BASE}/like/like/suggest/info/?url=${encodeURIComponent(url)}`)
  .then(res => (res.data || {}).title || '')
  .catch(() => '');

export const apiGetMyBookmark = (url = '') => axios.get(
  `${LIKECOIN_API}/users/bookmarks?url=${encodeURIComponent(url)}`,
  { withCredentials: true },
);

export const apiAddMyBookmark = (url = '', data) => axios.post(
  `${LIKECOIN_API}/users/bookmarks?url=${encodeURIComponent(url)}`,
  null,
  {
    headers: getLikeCoinButtonHeaders(data),
    withCredentials: true,
  },
);

export const apiDeleteMyBookmark = (id = '', data) => axios.delete(
  `${LIKECOIN_API}/users/bookmarks/${id}`,
  {
    headers: getLikeCoinButtonHeaders(data),
    withCredentials: true,
  },
);

export const apiGetMyFollower = (id = '') => axios.get(
  `${LIKECOIN_API}/users/follow/users/${id}`,
  { withCredentials: true },
);

export const apiAddMyFollower = (id = '', data) => axios.post(
  `${LIKECOIN_API}/users/follow/users/${id}`,
  null,
  {
    headers: getLikeCoinButtonHeaders(data),
    withCredentials: true,
  },
);

export const apiGetSupportingUserByID = (id = '') => axios.get(
  `${LIKECOIN_API}/civic/support/users/${id}`,
  { withCredentials: true },
);

// api for ISCN state

export const apiGetDataMinByIscnId = (iscnId = '') => axios.get(`${ISCN_RAW_DATA_ENDPOINT}${iscnId}`);

export const apiGetLikeButtonMyStatusByIscnId = (iscnId, data) => {
  const {
    isCookieSupport,
  } = data;
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.get(
    `${LIKECOIN_API}/like/likebutton/iscn/self?iscn_id=${iscnId}${cookieParam}&show_count=0`,
    {
      headers: getLikeCoinButtonHeaders(data),
      withCredentials: true,
    },
  );
};

export const apiGetLikeButtonSelfCountByIscnId = iscnId => axios.get(
  `${LIKECOIN_API}/like/likebutton/iscn/self/like?iscn_id=${iscnId}`, { withCredentials: true },
);

export const apiGetLikeButtonTotalCountByIscnId = iscnId => axios.get(
  `${LIKECOIN_API}/like/likebutton/iscn/total?iscn_id=${iscnId}`,
);

export const apiPostLikeButtonByIscnId = (iscnId, count = 1, data) => {
  const {
    isCookieSupport,
  } = data;
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.post(
    `${LIKECOIN_API}/like/likebutton/iscn/${count}?iscn_id=${iscnId}${cookieParam}`,
    {},
    {
      headers: getLikeCoinButtonHeaders(data),
      withCredentials: true,
    },
  );
};

export const apiGetLikeButtonLikerListByIscnId = iscnId => axios.get(
  `${LIKECOIN_API}/like/likebutton/iscn/list?iscn_id=${iscnId}`,
);

// TO-DO: handle superLike for ISCN
// export const apiGetSuperLikeMyStatusByIscnId = (tz = '', iscnId = '') => axios.get(
//   `${LIKECOIN_API}/like/share/self?tz=${tz}&iscn_id=${iscnId}`,
//   { withCredentials: true },
// );
