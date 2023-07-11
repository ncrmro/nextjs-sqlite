import { db } from "@/lib/kysely";

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
      <div>{post.body}</div>
    </div>
  );
}
