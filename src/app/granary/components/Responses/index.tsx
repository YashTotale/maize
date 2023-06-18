// React Imports
import axios from "axios";
import Kernel from "./Kernel";
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

interface ResponsesProps {
  query: string;
}

const Responses: AsyncFC<ResponsesProps> = async ({ query }) => {
  const data = await fetchGranaryData(query);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4 justify-items-center">
      {Object.entries(data.relevantDocs).map(([id, doc]) => (
        <Kernel key={id} id={id} {...doc} />
      ))}
    </div>
  );
};

export default Responses;
