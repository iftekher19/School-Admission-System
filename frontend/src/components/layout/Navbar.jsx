import { Link, NavLink } from "react-router-dom";
import { FaGraduationCap, FaClipboardList } from "react-icons/fa";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `btn btn-ghost btn-sm ${isActive ? "bg-primary/10 text-primary" : ""}`;

  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6">
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2">
            <FaGraduationCap className="text-3xl text-primary" />
            <div>
              <p className="text-base font-bold">School Admission</p>
              <p className="text-xs text-base-content/50">
                Admission Portal
              </p>
            </div>
          </Link>
        </div>

        <div className="navbar-end gap-2">
          <NavLink to="/" end className={linkClass}>
            Classes
          </NavLink>

          <NavLink to="/my-applications" className={linkClass}>
            <FaClipboardList />
            My Applications
          </NavLink>
        </div>
      </div>
    </header>
  );
}