// React Imports
import axios from "axios";
import Query from "./components/Query";
import Kernel from "./components/Kernel";
import { createServerAPIRoute } from "@/lib/urls";

export const metadata = {
  title: "Granary | Maize",
  description: "Find and Query your Maize Kernels",
};

interface Doc {
  filename: string;
  text: string;
}

interface GranaryData {
  relevantDocs: Record<string, Doc>;
}

const fetchGranaryData = async (): Promise<GranaryData> => {
  const { data } = await axios.get(createServerAPIRoute(`/api/granary`));
  return data.payload;
};

interface GranaryProps extends PageProps {}

const Granary: AsyncFC<GranaryProps> = async ({ searchParams }) => {
  const data = await fetchGranaryData();

  return (
    <div className="flex flex-col gap-8">
      <Query />
      <div className="flex flex-wrap gap-8">
        {Object.entries(data.relevantDocs).map(([id, doc]) => (
          <Kernel key={id} id={id} {...doc} />
        ))}
      </div>
    </div>
  );
};

export default Granary;
