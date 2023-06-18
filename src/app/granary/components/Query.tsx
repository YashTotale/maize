"use client";

// React Imports
import { FC, useState } from "react";

// Next.js Imports
import Link from "next/link";

interface QueryProps {
  currentValue: string; // The query param in the URL
}

const Query: FC<QueryProps> = ({ currentValue }) => {
  const [value, setValue] = useState(currentValue);

  return (
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
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Query Your Kernels..."
        required
        className="block w-full rounded-lg border border-gray-300 bg-gray-100 p-4 pl-10 text-sm shadow-md focus:border-blue-500 focus:ring-blue-500"
      />
      <Link
        href={{ href: "/granary", query: { query: value } }}
        className="absolute bottom-2.5 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Query
      </Link>
    </div>
  );
};

export default Query;
