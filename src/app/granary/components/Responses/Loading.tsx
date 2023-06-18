// React Imports
import { FC } from "react";
import KernelLoading from "./Kernel/Loading";

interface ResponsesLoadingProps {}

const ResponsesLoading: FC<ResponsesLoadingProps> = () => {
  return (
    <div className="grid grid-cols-4 gap-8 justify-items-center">
      {[...new Array(8)].map((_, i) => (
        <KernelLoading key={i} />
      ))}
    </div>
  );
};

export default ResponsesLoading;
