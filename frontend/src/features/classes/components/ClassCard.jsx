
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

import { useLanguage } from "../../../app/LanguageContext";

export default function ClassCard({ schoolClass }) {
  const { t } = useLanguage();

  const {
    id,
    name,
    totalSeats,
    heldSeats,
    confirmedSeats,
    availableSeats,
  } = schoolClass;

  const occupied = heldSeats + confirmedSeats;
  const percentage = totalSeats > 0 ? (occupied / totalSeats) * 100 : 0;

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="card-title text-lg">{name}</h2>
            <p className="text-sm text-base-content/60">
              {t("availability")}
            </p>
          </div>

          <div className="badge badge-primary badge-outline">
            {availableSeats > 0 ? t("open") : t("full")}
          </div>
        </div>

        <div className="my-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-base-200 p-3">
            <FaUsers className="mb-2 text-primary" />
            <p className="text-xl font-bold">{totalSeats}</p>
            <p className="text-xs text-base-content/60">{t("total")}</p>
          </div>

          <div className="rounded-xl bg-warning/10 p-3">
            <FaClock className="mb-2 text-warning" />
            <p className="text-xl font-bold">{heldSeats}</p>
            <p className="text-xs text-base-content/60">{t("held")}</p>
          </div>

          <div className="rounded-xl bg-success/10 p-3">
            <FaCheckCircle className="mb-2 text-success" />
            <p className="text-xl font-bold">{confirmedSeats}</p>
            <p className="text-xs text-base-content/60">
              {t("confirmed")}
            </p>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-base-content/60">
            {t("seatOccupancy")}
          </span>
          <span className="font-semibold">
            {Math.round(percentage)}%
          </span>
        </div>

        <progress
          className="progress progress-primary w-full"
          value={percentage}
          max="100"
        />

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs text-base-content/60">
              {t("availableSeats")}
            </p>
            <p className="text-2xl font-bold text-success">
              {availableSeats}
            </p>
          </div>

          <Link
            to={`/admission/${id}`}
            className={`btn btn-primary btn-sm ${
              availableSeats <= 0 ? "btn-disabled" : ""
            }`}
            aria-disabled={availableSeats <= 0}
            tabIndex={availableSeats <= 0 ? -1 : 0}
            onClick={(event) => {
              if (availableSeats <= 0) event.preventDefault();
            }}
          >
            {t("applyNow")} <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
