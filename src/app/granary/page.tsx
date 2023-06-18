// React Imports
import { FC } from "react";
import Query from "./components/Query";

export const metadata = {
  title: "Granary | Maize",
  description: "Find and Query your Maize Kernels",
};

interface GranaryProps {}

const Granary: FC<GranaryProps> = () => {
  return (
    <div className="flex flex-col">
      <Query />
    </div>
  );
};

export default Granary;
