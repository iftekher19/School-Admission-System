import { Link, NavLink } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";

function Navbar() {
  const navClass = ({ isActive }) =>
    `btn btn-ghost btn-sm ${
      isActive ? "text-primary" : ""
    }`;

  return (
    <div className="navbar border-b border-base-300 bg-base-100 px-4 sm:px-8">
      <div className="navbar-start">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <FaGraduationCap className="text-2xl text-primary" />
          School Admission
        </Link>
      </div>

      <div className="navbar-end gap-2">
        <NavLink to="/" end className={navClass}>
          Classes
        </NavLink>

        <NavLink to="/my-applications" className={navClass}>
          My Applications
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;