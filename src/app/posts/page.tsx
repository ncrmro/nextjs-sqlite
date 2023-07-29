import { db } from "@/lib/database";
import Link from "next/link";

export default async function Posts() {
  const posts = await db
    .selectFrom("posts")
    .select(["slug", "title", "body"])
    .execute();
  return (
    <div>
      <h1>Posts</h1>
      <ol>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
