// React Imports
import { FC } from "react";

interface KernelProps {
  id: string;
  filename: string;
  text: string;
}

const Kernel: FC<KernelProps> = ({ filename, text }) => {
  return (
    <div className="flex h-80 w-52 flex-col rounded-sm border border-gray-300 bg-gray-100">
      <div className="h-64 overflow-scroll p-4 text-xs">{text}</div>
      <div className="h-16 border-t border-gray-300 p-4">
        <p className="truncate text-sm font-medium">{filename}</p>
      </div>
    </div>
  );
};

export default Kernel;
