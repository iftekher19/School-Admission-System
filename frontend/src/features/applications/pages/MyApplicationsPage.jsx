
import { useCallback, useEffect, useState } from "react";
import {
  getMyApplications,
  cancelApplication,
} from "../services/applicationService";

import { useStudent } from "../../../app/StudentContext";
import { useLanguage } from "../../../app/LanguageContext";

export default function MyApplicationsPage() {
  const { studentId, isValidStudentId } = useStudent();
  const { language, t } = useLanguage();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  const loadApplications = useCallback(async (id) => {
    try {
      const data = await getMyApplications(id);
      setApplications(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError(t("unableToLoadApplications"));
    }
  }, [t]);

  useEffect(() => {
    if (!isValidStudentId) {
      setApplications([]);
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      await loadApplications(studentId);
      if (active) setLoading(false);
    };

    load();

    return () => {
      active = false;
    };
  }, [studentId, isValidStudentId, loadApplications]);

  useEffect(() => {
    if (!isValidStudentId) return;

    const interval = setInterval(() => {
      loadApplications(studentId);
    }, 5000);

    return () => clearInterval(interval);
  }, [studentId, isValidStudentId, loadApplications]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (holdId) => {
    if (!window.confirm(t("confirmCancel"))) return;

    try {
      await cancelApplication(holdId, studentId);
      await loadApplications(studentId);
    } catch {
      setError(t("unableToCancel"));
    }
  };

  const formatTime = (expiresAt) => {
    const remaining = Math.max(
      0,
      Math.ceil((new Date(expiresAt).getTime() - currentTime) / 1000)
    );

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const getStatus = (application) => {
    if (
      application.status === "HELD" &&
      new Date(application.expiresAt).getTime() <= currentTime
    ) {
      return "EXPIRED";
    }

    return application.status;
  };

  const getStatusLabel = (status) => {
    const labels = {
      HELD: language === "en" ? "HELD" : "সংরক্ষিত",
      CONFIRMED: language === "en" ? "CONFIRMED" : "নিশ্চিত",
      EXPIRED: language === "en" ? "EXPIRED" : "মেয়াদ শেষ",
      CANCELLED: language === "en" ? "CANCELLED" : "বাতিল",
    };

    return labels[status] || status;
  };

  const getStatusBadge = (status) => {
    const styles = {
      HELD: "badge-warning",
      CONFIRMED: "badge-success",
      EXPIRED: "badge-error",
      CANCELLED: "badge-neutral",
    };

    return (
      <span className={`badge ${styles[status] || "badge-ghost"}`}>
        {getStatusLabel(status)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("myApplications")}</h1>
        <p className="mt-2 text-base-content/60">
          {t("viewHistory")}
        </p>
      </div>

      {!isValidStudentId && (
        <div className="alert alert-warning">
          {t("enterStudentId")}
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {isValidStudentId && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">
              {t("applicationsFor")} {studentId}
            </h2>

            <span className="badge badge-outline">
              {applications.length} {t("applications")}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : applications.length === 0 ? (
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body items-center text-center">
                <h3 className="text-lg font-semibold">
                  {t("noApplications")}
                </h3>
                <p className="text-base-content/60">
                  {t("noReservations")}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {applications.map((application) => {
                const status = getStatus(application);

                return (
                  <div
                    key={application.holdId}
                    className="card border border-base-300 bg-base-100 shadow-sm"
                  >
                    <div className="card-body">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="card-title">
                            {application.className}
                          </h3>

                          <p className="mt-1 text-sm text-base-content/60">
                            {t("holdId")}: {application.holdId}
                          </p>
                        </div>

                        {getStatusBadge(status)}
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-base-content/60">
                            {t("studentId")}
                          </p>
                          <p className="font-medium">{studentId}</p>
                        </div>

                        <div>
                          <p className="text-sm text-base-content/60">
                            {t("expirationTime")}
                          </p>
                          <p className="font-medium">
                            {new Date(application.expiresAt).toLocaleString(
                              language === "bn" ? "bn-BD" : "en-US"
                            )}
                          </p>
                        </div>
                      </div>

                      {status === "HELD" && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-warning/10 p-3">
                          <div>
                            <p className="text-sm text-base-content/60">
                              {t("timeRemainingLabel")}
                            </p>
                            <p className="text-xl font-bold tabular-nums">
                              {formatTime(application.expiresAt)}
                            </p>
                          </div>

                          <button
                            className="btn btn-outline btn-error btn-sm"
                            onClick={() => handleCancel(application.holdId)}
                          >
                            {t("cancelReservation")}
                          </button>
                        </div>
                      )}

                      {status === "CONFIRMED" && (
                        <div className="alert alert-success mt-3">
                          {t("admissionConfirmedMessage")}
                        </div>
                      )}

                      {status === "EXPIRED" && (
                        <div className="alert alert-error mt-3">
                          {t("reservationExpiredMessage")}
                        </div>
                      )}

                      {status === "CANCELLED" && (
                        <div className="alert alert-warning mt-3">
                          {t("reservationCancelledMessage")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
