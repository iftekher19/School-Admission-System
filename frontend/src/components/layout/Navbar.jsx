
import { Link, NavLink } from "react-router-dom";
import { FaGraduationCap, FaClipboardList, FaGlobe } from "react-icons/fa";
import { useLanguage } from "../../app/LanguageContext";

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();

  const linkClass = ({ isActive }) =>
    `btn btn-ghost btn-sm ${isActive ? "bg-primary/10 text-primary" : ""}`;

  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="navbar mx-auto max-w-7xl flex-wrap px-4 sm:px-6">
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2">
            <FaGraduationCap className="text-3xl text-primary" />

            <div>
              <p className="text-base font-bold">
                {t("appName")}
              </p>
              <p className="text-xs text-base-content/50">
                {language === "en" ? "Admission Portal" : "Admission Portal"}
              </p>
            </div>
          </Link>
        </div>

        <div className="navbar-end flex-wrap gap-1">
          <NavLink to="/" end className={linkClass}>
            {language === "en" ? "Classes" : "শ্রেণিসমূহ"}
          </NavLink>

          <NavLink to="/my-applications" className={linkClass}>
            <FaClipboardList />
            {t("myApplications")}
          </NavLink>

          <button
            type="button"
            onClick={toggleLanguage}
            className="btn btn-outline btn-primary btn-sm"
            aria-label="Switch language"
          >
            <FaGlobe />
            {t("switchLanguage")}
          </button>
        </div>
      </div>
    </header>
  );
}
