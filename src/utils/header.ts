import { getAdminToken, getStudentToken } from "./cookies";

export const studentHeader = () => {
  const token = getStudentToken();
  if (!token) {
    return;
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};
export const adminHeader = () => {
  const token = getAdminToken();
  if (!token) {
    return;
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};
