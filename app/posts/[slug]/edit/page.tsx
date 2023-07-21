import PostForm from "@/app/posts/form";
import { selectSessionViewer } from "@/lib/auth";
import { db } from "@/lib/kysely";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function EditPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await db
    .selectFrom("posts")
    .select(["title", "body", "slug", "published"])
    .where("slug", "=", params.slug)
    .executeTakeFirstOrThrow();

  async function editPost(data: FormData) {
    "use server";
    const viewer = await selectSessionViewer();
    if (!viewer)
      throw new Error("Viewer must not be null when creating a post");

    console.log("", {
      title: data.get("title") as string,
      body: data.get("body") as string,
      // published: 1,
      user_id: viewer.id,
    });
    const post = await db
      .updateTable("posts")
      .set({
        title: data.get("title") as string,
        body: data.get("body") as string,
        // published: 1,
        user_id: viewer.id,
      })
      .where("slug", "=", params.slug)
      .returning(["title", "slug", "published"])
      .executeTakeFirstOrThrow();

    revalidatePath(`/posts/${post.slug}`);
    redirect(`/posts/${post.slug}`);
  }

  return <PostForm action={editPost} post={post} />;
}
