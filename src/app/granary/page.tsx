// React Imports
import { FC, Suspense } from "react";
import Query from "./components/Query";
import Kernels from "./components/Responses";
import KernelsLoading from "./components/Responses/Loading";

export const metadata = {
  title: "Granary | Maize",
  description: "Find and Query your Maize Kernels",
};

interface GranaryProps extends PageProps {}

const Granary: FC<GranaryProps> = ({ searchParams }) => {
  const query = searchParams.query ? searchParams.query.toString() : "";

  return (
    <div className="flex flex-col gap-8">
      <Query currentValue={query} />
      <Suspense fallback={<KernelsLoading />}>
        <Kernels query={query} />
      </Suspense>
    </div>
  );
};

export default Granary;
