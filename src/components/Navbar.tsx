// React Imports
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse as Home,
  faBuildingWheat as Granary,
} from "@fortawesome/free-solid-svg-icons";

// Next.js Imports
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  return (
    <header>
      <nav className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start ml-4">
          <Link href="/" title="Home" className="btn-ghost btn-circle btn">
            <FontAwesomeIcon icon={Home} className="h-5 w-5" />
          </Link>
        </div>
        <div className="navbar-center">
          <Image src="/maize.png" alt="Maize Logo" width={100} height={48} />
        </div>
        <div className="navbar-end mr-4">
          <Link
            href="/granary"
            title="Granary"
            className="btn-ghost btn-circle btn"
          >
            <FontAwesomeIcon icon={Granary} className="h-5 w-5" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
