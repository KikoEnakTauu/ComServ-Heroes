export type UserRole = 'user' | 'sso';

export const ROLES = {
  USER: 'user' as UserRole,
  SSO: 'sso' as UserRole,
};

export const permissions = {
  user: {
    canJoin: true,
    canAddEvent: false,
  },
  sso: {
    canJoin: false,
    canAddEvent: true,
  },
};
