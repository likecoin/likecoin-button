export function getAvatarHaloTypeFromUser(user = {}) {
  if (user.isPreRegCivicLiker) {
    return 'civic-liker-trial';
  }
  return 'none';
}

export default {
  getAvatarHaloTypeFromUser,
};
