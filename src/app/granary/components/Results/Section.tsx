// React Imports
import { FC, ReactElement } from "react";

interface SectionProps {
  title: string;
  content: ReactElement;
}

const Section: FC<SectionProps> = ({ title, content }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-xl">{title}</h3>
      {content}
    </div>
  );
};

export default Section;
