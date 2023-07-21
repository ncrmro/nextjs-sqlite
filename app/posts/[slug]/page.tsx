import { db } from "@/lib/kysely";
import Link from "next/link";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await db
    .selectFrom("posts")
    .select(["title", "body", "slug"])
    .where("slug", "=", params.slug)
    .executeTakeFirstOrThrow();
  return (
    <div>
      <h1>{post.title}</h1>
      <div id="post-body">{post.body}</div>
      <Link href={`/posts/${post.slug}/edit`}>Edit</Link>
    </div>
  );
}
