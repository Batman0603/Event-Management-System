// frontend/src/utils/roleCheck.js
export function hasRole(user, allowedRoles = []) {
  if (!user) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(user.role);
}