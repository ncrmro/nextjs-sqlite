import {
  handleSession,
  Passwords,
  selectSessionCookieUser,
  useViewer,
} from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/kysely";

async function loginUser(data: Map<string, string>) {
  "use server";
  const email = data.get("email")!;
  const password = data.get("password")!;
  try {
    const user = await db
      .selectFrom("users")
      .select(["id", "email", "password"])
      .where("email", "=", email)
      .executeTakeFirstOrThrow();
    const match = await Passwords.compare(user.password, password);
    if (!match) {
      redirect("/login?error=AUTH_INVALID_PASSWORD");
    } else await handleSession(user.id);
  } catch (e) {
    redirect("/login?error=AUTH_INVALID_USER");
  }
}

export default async function LoginPage() {
  const viewer = await selectSessionCookieUser();
  if (viewer) redirect("/dashboard");

  return (
    // @ts-ignore
    <form action={loginUser}>
      <div className="card">
        <h1 className="card-header">Login</h1>
        <div className="card-content flex-col gap-4">
          <input
            name="email"
            placeholder="Email"
            autoComplete="email"
            type="email"
            required
          />
          <input
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            type="password"
            required
          />
        </div>
        <div className="card-actions flex-col gap-4">
          <button type="submit" style={{ float: "right" }}>
            Login
          </button>
          {/*<Link href="/reset-password">Reset Password</Link>*/}
          <Link href="/signup">Create an account</Link>
        </div>
      </div>
    </form>
  );
}
