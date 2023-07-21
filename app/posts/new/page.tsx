import { db } from "@/lib/kysely";
import { selectSessionViewer, useViewer } from "@/lib/auth";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";
import PostForm from "@/app/posts/form";

// Would be good to debounce and check the title for uniqueness

async function createPost(data: FormData) {
  "use server";
  const viewer = await selectSessionViewer();
  if (!viewer) throw new Error("Viewer must not be null when creating a post");
  const title = data.get("title");
  if (typeof title !== "string") throw new Error("Title must be a string");

  const post = await db
    .insertInto("posts")
    .values({
      title: data.get("title") as string,
      body: data.get("body") as string,
      published: data.get("published") ? 1 : 0,
      user_id: viewer.id,
      slug: slugify(title),
    })
    .returning(["title", "slug", "published"])
    .executeTakeFirstOrThrow();
  redirect(`/posts/${post.slug}`);
}

export default async function CreatePost() {
  const viewer = await useViewer();
  if (!viewer)
    redirect(
      `/login?${new URLSearchParams({
        redirect: "/posts/new",
      }).toString()}`
    );
  return <PostForm action={createPost} />;
}
