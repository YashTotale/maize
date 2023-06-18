"use client";

// React Imports
import { FC, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Kernel from "./Kernel";
import KernelLoading from "./Kernel/Loading";
import { createServerAPIRoute } from "@/lib/urls";
import Section from "./Section";

// API Imports
import https from "https";

interface Node {
  start: string;
  end: string;
}

export interface Doc {
  filename: string;
  text: string;
  nodes?: Node[];
}

interface GranaryData {
  relevantDocs: Record<string, Doc>;
  textResponse: string;
}

const fetchGranaryData = async (query: string): Promise<GranaryData> => {
  const url = `/api/granary?query=${query}`;
  const { data } = await axios
    .create({
      httpsAgent: new https.Agent({ keepAlive: true }),
    })
    .get(createServerAPIRoute(url));
  return data.payload;
};

interface ResultsProps {
  query: string;
}

const Results: FC<ResultsProps> = ({ query }) => {
  const [data, setData] = useState<GranaryData | null>(null);

  useEffect(() => {
    setData(null);
    fetchGranaryData(query)
      .then((data) => {
        setData(data);
      })
      .catch((e) => {
        alert(`An error occurred: ${e.message}`);
      });
  }, [query]);

  const summary = useMemo(() => {
    if (!data) {
      return (
        <div role="status" className="space-y-2.5 animate-pulse w-full">
          <div className="flex items-center w-full space-x-2">
            <div className="h-2.5 bg-gray-100 rounded-full w-[25%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[25%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[50%]"></div>
          </div>
          <div className="flex items-center w-full space-x-2">
            <div className="h-2.5 bg-gray-100 rounded-full w-[40%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[20%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[40%]"></div>
          </div>
          <div className="flex items-center w-full space-x-2">
            <div className="h-2.5 bg-gray-100 rounded-full w-[33%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[50%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[17%]"></div>
          </div>
          <div className="flex items-center w-full space-x-2">
            <div className="h-2.5 bg-gray-100 rounded-full w-[19%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[34%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[47%]"></div>
          </div>
          <div className="flex items-center w-full space-x-2">
            <div className="h-2.5 bg-gray-100 rounded-full w-[25%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[25%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[50%]"></div>
          </div>
          <div className="flex items-center w-full space-x-2">
            <div className="h-2.5 bg-gray-100 rounded-full w-[50%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[25%]"></div>
            <div className="h-2.5 bg-gray-100 rounded-full w-[25%]"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    return <div>{data.textResponse}</div>;
  }, [data]);

  const kernels = useMemo(() => {
    if (!data) {
      return [...new Array(8)].map((_, i) => <KernelLoading key={i} />);
    }

    return Object.entries(data.relevantDocs).map(([id, doc]) => (
      <Kernel key={id} {...doc} />
    ));
  }, [data]);

  return (
    <>
      <h2 className="font-bold text-3xl text-center">
        {query ? `Results for "${query}"` : "Your Granary"}
      </h2>
      {query && <Section title="Summary" content={summary} />}
      <Section
        title={query ? "Relevant Kernels" : "Kernels"}
        content={
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 justify-items-center">
            {kernels}
          </div>
        }
      />
    </>
  );
};

export default Results;
