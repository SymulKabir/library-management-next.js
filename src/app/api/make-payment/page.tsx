import { db } from "@/src/lib/db";
import { decodedToken } from "@/src/utils/token";

export const POST = async (request: Request) => {
  try {
    const authHeader = request.headers.get("Authorization");
     
    return Response.json({ data: records });
  } catch (error: any) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};

