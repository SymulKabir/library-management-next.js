import jwt from "jsonwebtoken";

interface TokenPayload {
  student_id?: number;
  admin_id?: number;
  email: string;
}

const generateToken = ({
  student_id,
  admin_id,
  email,
}: TokenPayload): string => {
  const jwtData: TokenPayload = { email };

  if (student_id) {
    jwtData.student_id = student_id;
  }

  if (admin_id) {
    jwtData.admin_id = admin_id;
  }

  const token = jwt.sign({ ...jwtData }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return token;
};

const decodedToken = (authToken: any) => {
  try {
    if (!authToken) {
      return;
    }
    let token = authToken;
    if (token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      return;
    }
    return { ...decoded };
  } catch (error) {
  }
};

export { generateToken, decodedToken };
