import jwt from 'jsonwebtoken';

interface TokenPayload {
  student_id: number;
  email: string;
}

const generateToken = ({ student_id, email }: TokenPayload): string => {
  const token = jwt.sign(
    { student_id: student_id, email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return token;
};



export  {generateToken};
