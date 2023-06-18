// React Imports
import { FC, useMemo } from "react";
import { Doc } from "../index";

interface KernelProps extends Doc {}

const Kernel: FC<KernelProps> = ({ filename, text, nodes }) => {
  const splitText = useMemo(() => {
    return nodes
      ? nodes.reduceRight((highlighted, node) => {
          console.log(node, parseInt(node.start), parseInt(node.end));
          const before = highlighted.slice(0, parseInt(node.start));
          const toHighlight = highlighted.slice(
            parseInt(node.start),
            parseInt(node.end)
          );
          const after = highlighted.slice(parseInt(node.end));

          return `${before}<span style="background-color:limegreen">${toHighlight}</span>${after}`;
        }, text)
      : text;
  }, [nodes, text]);

  return (
    <div className="flex h-80 w-52 flex-col rounded-sm border border-gray-300 bg-gray-100">
      <div
        className="h-64 overflow-scroll p-4 text-xs"
        dangerouslySetInnerHTML={{ __html: splitText }}
      ></div>
      <div className="h-16 border-t border-gray-300 p-4">
        <p className="truncate text-sm font-medium">{filename}</p>
      </div>
    </div>
  );
};

export default Kernel;
