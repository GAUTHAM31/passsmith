export const PasswordType = {
  Random: 'random',
  Memorable: 'memorable',
  Pin: 'pin'
} as const;

export type PasswordType = typeof PasswordType[keyof typeof PasswordType];

export const Profile = {
  Social: 'social',
  Work: 'work',
  Personal: 'personal',
  Banking: 'banking',
  Shared: 'shared',
  Shopping: 'shopping',
  Email: 'email',
  Gaming: 'gaming',
} as const;

export type Profile = typeof Profile[keyof typeof Profile];
