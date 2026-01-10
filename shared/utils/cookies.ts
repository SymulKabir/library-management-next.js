import Cookies from "js-cookie";


export const setToken = (token: string) => {
  Cookies.set("auth-token", token, { expires: 7 });
}
export const getToken = () => {
  return Cookies.get("auth-token");
}

export const removeToken = () => {
  Cookies.remove("auth-token");
}