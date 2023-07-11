import { db } from "@/lib/kysely";
import { selectSessionViewer, useViewer } from "@/lib/auth";
import { redirect } from "next/navigation";

// Would be good to debounce and check the title for uniqueness

async function createPost(data: FormData) {
  "use server";
  const viewer = await selectSessionViewer();
  if (!viewer) throw new Error("Viewer must not be null when creating a post");

  const post = await db
    .insertInto("posts")
    .values({
      title: data.get("title"),
      body: data.get("body"),
      published: data.get("published"),
      user_id: viewer.id,
    })
    .returning("slug")
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
  return (
    // @ts-ignore
    <form action={createPost} className="flex-col">
      <div className="space-y-12">
        <div className="col-span-full">
          <label
            htmlFor="title"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="title"
              id="title"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="col-span-full">
          <label
            htmlFor="body"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Body
          </label>
          <div className="mt-2">
            <textarea
              id="body"
              name="body"
              rows={25}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={""}
            />
          </div>
        </div>

        <div className="float-right">
          <button type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
}
