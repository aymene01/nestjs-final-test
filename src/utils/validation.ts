const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const isValidEmail = (email: string) => EMAIL_REGEX.test(email);
