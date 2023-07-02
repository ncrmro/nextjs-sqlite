import "./globals.css";
import Link from "next/link";
import React from "react";
import "./global.css";

export const metadata = {
  title: "Vercel Postgres Demo with Kysely",
  description:
    "A simple Next.js app with Vercel Postgres as the database and Kysely as the ORM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav id="navbar" className="flex justify-between w-full">
          <div>
            <Link href="/">NSLITE</Link>
          </div>
          <div>
            <Link href="/login">Sign in</Link>
          </div>
        </nav>
        <main className="w-full flex-col items-center p-4">{children}</main>
      </body>
    </html>
  );
}
