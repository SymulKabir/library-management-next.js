import Cookies from "js-cookie";


export const setStudentToken = (token: string) => {
  Cookies.set("student-auth-token", token, { expires: 7 });
}
export const getStudentToken = () => {
  return Cookies.get("student-auth-token");
}

export const removeStudentToken = () => {
  Cookies.remove("student-auth-token");
}


export const setAdminToken = (token: string) => {
  Cookies.set("admin-auth-token", token, { expires: 7 });
}
export const getAdminToken = () => {
  return Cookies.get("admin-auth-token");
}

export const removeAdminToken = () => {
  Cookies.remove("admin-auth-token");
}