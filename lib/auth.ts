import { scrypt, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { promisify } from "util";
import { db } from "@/lib/kysely";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export namespace Passwords {
  // scrypt is callback based so with promisify we can await it
  const scryptAsync = promisify(scrypt);

  export async function hash(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  export async function compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    // split() returns array
    const [hashedPassword, salt] = storedPassword.split(".");
    // we need to pass buffer values to timingSafeEqual
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    // we hash the new sign-in password
    const suppliedPasswordBuf = (await scryptAsync(
      suppliedPassword,
      salt,
      64
    )) as Buffer;
    // compare the new supplied password with the stored hashed password
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  }
}

export async function handleSession(userId: string) {
  const session = await db
    .insertInto("sessions")
    .values({ user_id: userId })
    .returning("id")
    .executeTakeFirstOrThrow();
  cookies().set({
    name: "viewer_session",
    value: session.id,
  });
}

export async function selectSessionViewer() {
  const session = cookies().get("viewer_session")?.value;
  if (session) {
    return await db
      .selectFrom("users")
      .innerJoin("sessions", "sessions.user_id", "users.id")
      .select(["users.id", "users.email"])
      .where("sessions.id", "=", session)
      .executeTakeFirst();
  }
}

export async function useViewer() {
  return selectSessionViewer();
}
