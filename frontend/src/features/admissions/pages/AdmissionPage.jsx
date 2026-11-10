
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  confirmAdmission,
  createAdmissionHold,
  getClassDetails,
  getHoldStatus,
} from "../services/admissionService";

import { useStudent } from "../../../app/StudentContext";
import { useLanguage } from "../../../app/LanguageContext";

export default function AdmissionPage() {
  const { classId } = useParams();
  const { studentId, isValidStudentId } = useStudent();
  const { language, t } = useLanguage();

  const [schoolClass, setSchoolClass] = useState(null);
  const [hold, setHold] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refreshClass = useCallback(async () => {
    const data = await getClassDetails(classId);
    setSchoolClass(data);
  }, [classId]);

  useEffect(() => {
    const loadClass = async () => {
      try {
        setLoading(true);
        setError("");
        await refreshClass();
      } catch {
        setError(t("unableToLoadDetails"));
      } finally {
        setLoading(false);
      }
    };

    loadClass();
  }, [refreshClass, t]);

  // Update countdown every second.
  useEffect(() => {
    if (!hold || hold.status !== "HELD") return;

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.ceil(
          (new Date(hold.expiresAt).getTime() - Date.now()) / 1000
        )
      );

      setRemainingSeconds(remaining);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [hold]);

  // Check hold status periodically.
  useEffect(() => {
    if (!hold || hold.status !== "HELD") return;

    const checkStatus = async () => {
      try {
        const latestHold = await getHoldStatus(hold.holdId);
        setHold(latestHold);
      } catch (err) {
        console.error("Unable to refresh hold status:", err);
      }
    };

    const interval = setInterval(checkStatus, 3000);

    return () => clearInterval(interval);
  }, [hold?.holdId, hold?.status]);

  const handleReserveSeat = async (event) => {
    event.preventDefault();

    if (!isValidStudentId) {
      setError(t("enterStudentIdError"));
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const result = await createAdmissionHold(classId, studentId);

      setHold(result);
      await refreshClass();

      setSuccess(t("seatReserved"));
    } catch (err) {
      setError(err.message || t("unableToReserve"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmAdmission = async () => {
    if (!hold || hold.status !== "HELD" || remainingSeconds <= 0) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const result = await confirmAdmission(hold.holdId, studentId);

      setHold((previous) => ({
        ...previous,
        status: result.status,
      }));

      await refreshClass();

      setSuccess(t("admissionConfirmedMessage"));
    } catch (err) {
      setError(err.message || t("unableToConfirm"));

      try {
        const latestHold = await getHoldStatus(hold.holdId);
        setHold(latestHold);
      } catch {
        // Keep the original error visible.
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remaining
    ).padStart(2, "0")}`;
  };

  const isExpired =
    hold?.status === "EXPIRED" ||
    (hold?.status === "HELD" && remainingSeconds <= 0);

  const formatStatus = (status) => {
    if (language === "en") return isExpired ? "EXPIRED" : status;

    const labels = {
      HELD: "সংরক্ষিত",
      CONFIRMED: "নিশ্চিত",
      EXPIRED: "মেয়াদ শেষ",
      CANCELLED: "বাতিল",
    };

    return labels[isExpired ? "EXPIRED" : status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!schoolClass) {
    return (
      <div className="alert alert-error">
        {error || t("classNotFound")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {t("admissionApplication")}
        </h1>
        <p className="mt-2 text-base-content/60">
          {t("reserveAndConfirm")}
        </p>
      </div>

      {/* Class details */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{schoolClass.name}</h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-base-content/60">
                {t("totalSeatsLabel")}
              </p>
              <p className="text-2xl font-bold">
                {schoolClass.totalSeats}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content/60">
                {t("heldSeats")}
              </p>
              <p className="text-2xl font-bold text-warning">
                {schoolClass.heldSeats}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content/60">
                {t("confirmedSeats")}
              </p>
              <p className="text-2xl font-bold text-success">
                {schoolClass.confirmedSeats}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content/60">
                {t("availableSeatsLabel")}
              </p>
              <p className="text-2xl font-bold text-primary">
                {schoolClass.availableSeats}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error and success messages */}
      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div role="status" className="alert alert-success">
          <span>{success}</span>
        </div>
      )}

      {/* Reservation form */}
      {!hold && (
        <form
          onSubmit={handleReserveSeat}
          className="card border border-base-300 bg-base-100 shadow-sm"
        >
          <div className="card-body">
            <h2 className="card-title">{t("reserveYourSeat")}</h2>

            <div className="rounded-lg bg-base-200 p-3">
              <p className="text-sm text-base-content/60">
                {t("studentId")}
              </p>
              <p className="font-semibold">
                {isValidStudentId
                  ? studentId
                  : t("enterStudentId")}
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={
                submitting ||
                !isValidStudentId ||
                schoolClass.availableSeats <= 0
              }
            >
              {submitting ? (
                <span className="loading loading-spinner" />
              ) : (
                t("reserveSeat")
              )}
            </button>

            {!isValidStudentId && (
              <p className="text-sm text-error">
                {t("enterStudentIdError")}
              </p>
            )}

            {schoolClass.availableSeats <= 0 && (
              <p className="text-sm text-error">
                {t("noSeatsAvailable")}
              </p>
            )}
          </div>
        </form>
      )}

      {/* Hold information */}
      {hold && (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">
              {t("admissionReservation")}
            </h2>

            <div className="space-y-3 text-sm">
              <p>
                <strong>{t("studentId")}:</strong>{" "}
                {hold.studentId || studentId}
              </p>

              <p>
                <strong>{t("holdId")}:</strong> {hold.holdId}
              </p>

              <p>
                <strong>{t("status")}:</strong>{" "}
                <span
                  className={`badge ${
                    hold.status === "CONFIRMED"
                      ? "badge-success"
                      : hold.status === "HELD"
                        ? isExpired ? "badge-error" : "badge-warning"
                        : "badge-error"
                  }`}
                >
                  {formatStatus(hold.status)}
                </span>
              </p>

              <p>
                <strong>{t("expiresAt")}:</strong>{" "}
                {new Date(hold.expiresAt).toLocaleString(
                  language === "bn" ? "bn-BD" : "en-US"
                )}
              </p>
            </div>

            {hold.status === "HELD" && !isExpired && (
              <div className="mt-4 rounded-lg bg-warning/10 p-4 text-center">
                <p className="text-sm text-base-content/70">
                  {t("timeRemaining")}
                </p>

                <p className="mt-1 text-3xl font-bold tabular-nums">
                  {formatTime(remainingSeconds)}
                </p>
              </div>
            )}

            {hold.status === "HELD" && (
              <button
                onClick={handleConfirmAdmission}
                className="btn btn-primary mt-4"
                disabled={submitting || isExpired}
              >
                {submitting ? (
                  <span className="loading loading-spinner" />
                ) : (
                  t("payAdmissionFee")
                )}
              </button>
            )}

            {hold.status === "CONFIRMED" && (
              <div className="alert alert-success mt-4">
                {t("admissionConfirmed")}
              </div>
            )}

            {isExpired && (
              <div className="alert alert-error mt-4">
                {t("reservationExpired")}
              </div>
            )}

            {hold.status === "CANCELLED" && (
              <div className="alert alert-warning mt-4">
                {t("reservationCancelled")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
