// React Imports
import { FC } from "react";
import KernelUpload from "@/components/KernelUpload";

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-8xl font-bold">
            M<span className="text-green-300">ai</span>ze
          </h1>
          <KernelUpload />
        </div>
      </div>
    </div>
  );
};

export default Home;
