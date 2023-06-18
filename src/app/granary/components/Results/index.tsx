"use client";

// React Imports
import { FC, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Kernel from "./Kernel";
import KernelLoading from "./Kernel/Loading";
import { createServerAPIRoute } from "@/lib/urls";

interface Doc {
  filename: string;
  text: string;
}

interface GranaryData {
  relevantDocs: Record<string, Doc>;
}

const fetchGranaryData = async (query: string): Promise<GranaryData> => {
  const url = `/api/granary?query=${query}`;
  const { data } = await axios.get(createServerAPIRoute(url));
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

  const kernels = useMemo(() => {
    if (!data) {
      return [...new Array(8)].map((_, i) => <KernelLoading key={i} />);
    }

    return Object.entries(data.relevantDocs).map(([id, doc]) => (
      <Kernel key={id} id={id} {...doc} />
    ));
  }, [data]);

  return (
    <>
      <h2 className="font-semibold text-2xl text-center">
        {query ? `Results for "${query}"` : "Your Granary"}
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4 justify-items-center">
        {kernels}
      </div>
    </>
  );
};

export default Results;
