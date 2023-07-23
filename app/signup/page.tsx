import React from "react";
import { handleSession, Passwords, useViewer } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/database";

async function registerUser(data: Map<string, string>) {
  "use server";
  const email = data.get("email")!;
  const password = data.get("password")!;

  try {
    const user = await db
      .insertInto("users")
      .values({ email, password: await Passwords.hash(password) })
      .returning(["id"])
      .executeTakeFirstOrThrow();
    await handleSession(user.id);
  } catch (e) {
    console.error(e);
    redirect("/signup?error=AUTH_INVALID_USER");
  }
}

export default async function SignupPage(props: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const viewer = await useViewer();
  if (viewer) redirect("/dashboard");
  const error = props.searchParams.error;

  return (
    // @ts-ignore
    <form action={registerUser}>
      <div className="card">
        <h1 className="card-header">Create account</h1>
        <div>
          {error === "AUTH_INVALID_USER" && (
            <p>Error signing you in check email or password</p>
          )}
        </div>
        <div className="card-content flex-col gap-4">
          <input
            name="email"
            placeholder="Email"
            type="email"
            autoComplete="username"
            required
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="card-actions flex justify-items-center">
          <button type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
}
