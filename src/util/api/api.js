import axios from '~/plugins/axios';
import { LIKECOIN_API, ISCN_RAW_DATA_ENDPOINT } from '@/constant';

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
    iscnId = '',
  } = data;
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.get(
    id === 'iscn'
      ? `${LIKECOIN_API}/like/likebutton/iscn/self?iscn_id=${encodeURIComponent(iscnId)}${cookieParam}&show_count=0`
      : `${LIKECOIN_API}/like/likebutton/${id}/self?referrer=${encodeURIComponent(referrer)}${cookieParam}&show_count=0`,
    {
      headers: getLikeCoinButtonHeaders(data),
      withCredentials: true,
    },
  );
};

export const apiGetLikeButtonSelfCount = (id, data) => {
  const {
    referrer,
    iscnId,
  } = data;
  return axios.get(
    id === 'iscn'
      ? `${LIKECOIN_API}/like/likebutton/iscn/self/like?iscn_id=${encodeURIComponent(iscnId)}`
      : `${LIKECOIN_API}/like/likebutton/${id}/self/like?referrer=${encodeURIComponent(referrer)}`,
    { withCredentials: true },
  );
};

export const apiGetSuperLikeInfo = id => axios.get(`${LIKECOIN_API}/like/share/${id}`);

export const apiGetSuperLikeMyStatus = (tz, data) => {
  const {
    referrer,
    iscnId,
  } = data;
  return axios.get(
    iscnId
      ? `${LIKECOIN_API}/like/share/iscn/self?tz=${tz}&iscn_id=${encodeURIComponent(iscnId)}`
      : `${LIKECOIN_API}/like/share/self?tz=${tz}&referrer=${encodeURIComponent(referrer)}`,
    { withCredentials: true },
  );
};

export const apiGetLikeButtonTotalCount = (id, data) => {
  const {
    referrer,
    iscnId,
  } = data;
  return axios.get(
    id === 'iscn'
      ? `${LIKECOIN_API}/like/likebutton/iscn/total?iscn_id=${encodeURIComponent(iscnId)}`
      : `${LIKECOIN_API}/like/likebutton/${id}/total?referrer=${encodeURIComponent(referrer)}`,
  );
};

export const apiGetLikeButtonLikerList = (id, data) => {
  const {
    referrer,
    iscnId,
  } = data;
  return axios.get(
    id === 'iscn'
      ? `${LIKECOIN_API}/like/likebutton/iscn/list?iscn_id=${encodeURIComponent(iscnId)}`
      : `${LIKECOIN_API}/like/likebutton/${id}/list?referrer=${encodeURIComponent(referrer)}`,
  );
};

export const apiGetLikeButtonLikerListByIscnId = iscnId => axios.get(
  `${LIKECOIN_API}/like/likebutton/iscn/list?iscn_id=${encodeURIComponent(iscnId)}`,
);

export const apiPostLikeButton = (id, count = 1, data) => {
  const {
    referrer = '',
    iscnId,
    isCookieSupport,
  } = data;
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.post(
    id === 'iscn'
      ? `${LIKECOIN_API}/like/likebutton/iscn/${count}?iscn_id=${encodeURIComponent(iscnId)}${cookieParam}`
      : `${LIKECOIN_API}/like/likebutton/${id}/${count}?referrer=${encodeURIComponent(referrer)}${cookieParam}`,
    {},
    {
      headers: getLikeCoinButtonHeaders(data),
      withCredentials: true,
    },
  );
};

export const apiPostLikeButtonByIscnId = (iscnId, count = 1, data) => {
  const {
    isCookieSupport,
  } = data;
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.post(
    `${LIKECOIN_API}/like/likebutton/iscn/${count}?iscn_id=${encodeURIComponent(iscnId)}${cookieParam}`,
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
    iscnId,
  } = data;
  return axios.post(
    id === 'iscn'
      ? `${LIKECOIN_API}/like/share/iscn/?iscn_id=${encodeURIComponent(iscnId)}`
      : `${LIKECOIN_API}/like/share/${id}`,
    {
      referrer,
      tz,
      iscnId,
    },
    {
      headers: getLikeCoinButtonHeaders(data),
      withCredentials: true,
    },
  );
};

export const apiQueryCoinGeckoInfo = () => axios.get('https://api.coingecko.com/api/v3/coins/likecoin?localization=false', { withCredentials: false });

export const apiGetPageTitle = url => axios.get(`${LIKECOIN_API}/like/like/suggest/info/?url=${encodeURIComponent(url)}`)
  .then(res => (res.data || {}).title || '')
  .catch(() => '');

export const apiGetSupportingUserByID = (id = '') => axios.get(
  `${LIKECOIN_API}/civic/support/users/${id}`,
  { withCredentials: true },
);

// api for ISCN state

export const apiGetDataMinByIscnId = (iscnId = '') => axios.get(`${ISCN_RAW_DATA_ENDPOINT}${encodeURIComponent(iscnId)}`);
