// React Imports
import { FC } from "react";
import KernelUpload from "@/components/KernelUpload";

// Next.js Imports
import Image from "next/image";

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  return (
    <div className="hero">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <Image src="/maize.png" alt="Maize Logo" width={400} height={150} />
          <KernelUpload />
        </div>
      </div>
    </div>
  );
};

export default Home;
