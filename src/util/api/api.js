import axios from '~/plugins/axios';
import { LIKECOIN_API, LIKECOIN_MISC_API_BASE } from '@/constant';

export const apiGetUserMinById = id => axios.get(`${LIKECOIN_API}/api/users/id/${id}/min`);

export const apiGetSocialListById = id => axios.get(`${LIKECOIN_API}/api/social/list/${id}`);

export const apiGetLikeButtonMyStatus =
  (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/self`, { params: { referrer } });

export const apiGetLikeButtonTotalCount =
  (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/total`, { params: { referrer } });

export const apiGetLikeButtonLikerList =
  (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/list`, { params: { referrer } });

export const apiPostLikeButton =
  (id, referrer, count = 1) => axios.post(
    `${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/${count}`,
    {},
    { params: { referrer } },
  );
