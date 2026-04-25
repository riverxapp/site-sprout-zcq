import { getServerSession as getNextAuthSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function getServerSession() {
  return getNextAuthSession(authOptions);
}

export async function signIn(email: string, password: string) {
  const { signIn: nextAuthSignIn } = await import("next-auth/react");
  return nextAuthSignIn("credentials", {
    email,
    password,
    redirect: false,
  });
}

export async function signOut() {
  const { signOut: nextAuthSignOut } = await import("next-auth/react");
  return nextAuthSignOut({ redirect: false });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
