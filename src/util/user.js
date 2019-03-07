export function getAvatarHaloTypeFromUser(user = {}) {
  if (user.isCivicLikerTrial || user.isSubscribedCivicLiker) {
    return 'civic-liker';
  }
  return 'none';
}

export default {
  getAvatarHaloTypeFromUser,
};
