// React Imports
import { FC } from "react";

interface KernelLoadingProps {}

const KernelLoading: FC<KernelLoadingProps> = () => {
  return <div className="h-80 w-52 animate-pulse rounded-sm border bg-gray-100 border-gray-300" />;
};

export default KernelLoading;
