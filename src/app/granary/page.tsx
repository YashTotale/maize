// React Imports
import { FC } from "react";
import Query from "./components/Query";
import Results from "./components/Results";

export const metadata = {
  title: "Granary | Maize",
  description: "Find and Query your Maize Kernels",
};

interface GranaryProps extends PageProps {}

const Granary: FC<GranaryProps> = ({ searchParams }) => {
  const query = searchParams.query ? searchParams.query.toString() : "";

  return (
    <div className="flex flex-col gap-6">
      <Query />
      <Results query={query} />
    </div>
  );
};

export default Granary;
