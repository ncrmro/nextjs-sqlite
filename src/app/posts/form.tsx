"use client";
import { useState } from "react";

export default function PostForm(props: {
  action: (data: FormData) => Promise<void>;
  post?: {
    title: string;
    body: string;
    published: number | null;
  };
}) {
  const [state, setState] = useState(props.post);

  return (
    // @ts-ignore
    <form action={props.action} className="flex-col">
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
              value={state?.title}
              onChange={(e) =>
                state && setState({ ...state, title: e.target.value })
              }
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
              value={state?.body}
              onChange={(e) =>
                state && setState({ ...state, body: e.target.value })
              }
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
