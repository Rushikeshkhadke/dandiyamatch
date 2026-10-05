import { useStore } from '../store/useStore';

export function useProfile() {
  const { user, updateUser, logout } = useStore();

  const toggleHasPartner = (hasPartner) => {
    updateUser({ has_partner: hasPartner });
  };

  const updateProfile = (data) => {
    updateUser(data);
  };

  return {
    profile: user,
    updateProfile,
    toggleHasPartner,
    logout,
  };
}
