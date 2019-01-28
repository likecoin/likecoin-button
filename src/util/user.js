export function getAvatarHaloTypeFromUser(user = {}) {
  if (user.isCivicLikerTrial) {
    return 'civic-liker-trial';
  }
  if (user.isSubscribedCivicLiker) {
    return 'civic-liker';
  }
  return 'none';
}

export default {
  getAvatarHaloTypeFromUser,
};
