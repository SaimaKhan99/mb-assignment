export const createUniqueEmail = (prefix = 'qa.candidate'): string => {
  const timestamp = Date.now();
  return `${prefix}+${timestamp}@example.com`;
};
