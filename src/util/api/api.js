import axios from '~/plugins/axios';
import { LIKECOIN_API, LIKECOIN_MISC_API_BASE } from '@/constant';

export const apiGetUserMinById = id => axios.get(`${LIKECOIN_API}/api/users/id/${id}/min`);

export const apiGetSocialListById = (id, type = '') => axios.get(`${LIKECOIN_API}/api/social/list/${id}?type=${type}`);

export const apiGetLikeButtonMyStatus = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/self?referrer=${encodeURIComponent(referrer)}`);

export const apiGetLikeButtonTotalCount = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/total?referrer=${encodeURIComponent(referrer)}`);

export const apiGetLikeButtonLikerList = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/list?referrer=${encodeURIComponent(referrer)}`);

export const apiPostLikeLink = (id, referrer, payload) => axios.post(
  `${LIKECOIN_MISC_API_BASE}/api/like/likelink/${id}?referrer=${encodeURIComponent(referrer)}`,
  payload,
);

export const apiPostLikeButton = (id, referrer, count = 1) => axios.post(
  `${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/${count}?referrer=${encodeURIComponent(referrer)}`,
  {},
);

export const apiQueryCoinGeckoInfo = () => axios.get('https://api.coingecko.com/api/v3/coins/likecoin?localization=false', { withCredentials: false });

export const apiGetPageTitle = url => axios.get(url, {
  withCredentials: false,
  headers: {
    Accept: 'text/html',
  },
}).then((res) => {
  const matches = res.data && res.data.match(/<title>(.*?)<\/title>/);
  return matches ? matches[1] : '';
});
