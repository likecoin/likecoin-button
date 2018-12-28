import { CIVIC_LIKER_TRIAL_END_DATE } from '../constant';

export function getAvatarHaloTypeFromUser(user = {}) {
  if (user.isSubscribedCivicLiker) {
    return 'civic-liker';
  }
  if (user.isPreRegCivicLiker && Date.now() <= CIVIC_LIKER_TRIAL_END_DATE) {
    return 'civic-liker-trial';
  }
  return 'none';
}

export default {
  getAvatarHaloTypeFromUser,
};
