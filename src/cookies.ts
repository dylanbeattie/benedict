export function setCookie(name: string, value: string) {
    const expires = new Date();
	const SEVEN_DAYS_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
    expires.setTime(expires.getTime() + SEVEN_DAYS_IN_MILLISECONDS);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

export function getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split(`; ${name}=`);
    return parts.pop()?.split(";").shift();
}

export function deleteCookie(name: string) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (-1 * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=; expires=${expires.toUTCString()}; path=/`;
}