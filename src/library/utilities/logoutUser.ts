let logoutFn: () => Promise<void> = async () => {
  console.warn('Logout called before it was initialized.');
};

export const setLogoutFn = (fn: () => Promise<void>) => {
  logoutFn = fn;
};

export const logout = async () => {
  await logoutFn();
};
