// React Imports
import { FC } from "react";
import GrainUpload from "@/components/GrainUpload";

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-8xl font-bold">
            M<span className="text-green-300">ai</span>ze
          </h1>
          <p className="py-6">Upload your Grains (files) to get started</p>
          <GrainUpload />
        </div>
      </div>
    </div>
  );
};

export default Home;
