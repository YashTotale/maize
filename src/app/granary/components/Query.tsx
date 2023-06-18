"use client";

// React Imports
import { FC, FormEventHandler, useState } from "react";

// Next.js Imports
import { useRouter } from "next/navigation";

interface QueryProps {}

const Query: FC<QueryProps> = () => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    router.push(`/granary?query=${value}`);
    setValue("");
  };

  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          id="default-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Query Your Kernels..."
          className="block w-full rounded-lg border border-gray-300 bg-gray-100 p-4 pl-10 text-sm shadow-md focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="absolute bottom-2.5 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Query
        </button>
      </div>
    </form>
  );
};

export default Query;
