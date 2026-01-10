import { getToken } from "@/shared/utils/cookies";

interface CheckSigninProps {
  host?: string;
  token?: string;
}

interface Student {
  student_id: string;
  name: string;
  email: string;
  created_at: number;
}

export const checkSignin = async ({ host, token: tokenInput }: CheckSigninProps): Promise<Student | null> => {
  try {
    const token = tokenInput || getToken();
    console.log("token: ==>>", token);

    if (!token) return null;

    const URL = host ? `${host}/api/students/check-signin` : `/api/students/check-signin`;
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.error("CheckSignin failed with status:", response.status);
      return null;
    }

    const { data } = await response.json();
    return data || null;
  } catch (error) {
    console.error("CheckSignin error:", error);
    return null;
  }
};
