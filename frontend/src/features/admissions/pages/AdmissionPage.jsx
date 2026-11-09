import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  confirmAdmission,
  createAdmissionHold,
  getClassDetails,
  getHoldStatus,
} from "../services/admissionService";

export default function AdmissionPage() {
  const { classId } = useParams();

  const [schoolClass, setSchoolClass] = useState(null);
  const [studentId, setStudentId] = useState("");
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

  // Load selected class
  useEffect(() => {
    const loadClass = async () => {
      try {
        setLoading(true);
        setError("");
        await refreshClass();
      } catch (err) {
        setError(err.message || "Unable to load class details.");
      } finally {
        setLoading(false);
      }
    };

    loadClass();
  }, [refreshClass]);

  // Update countdown every second
  useEffect(() => {
    if (!hold || hold.status !== "HELD") return;

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((new Date(hold.expiresAt).getTime() - Date.now()) / 1000)
      );

      setRemainingSeconds(remaining);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [hold]);

  // Check hold status periodically
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

    if (!studentId.trim()) {
      setError("Please enter your Student ID.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const result = await createAdmissionHold(
        classId,
        studentId.trim()
      );

      setHold(result);
      await refreshClass();

      setSuccess("Your seat has been temporarily reserved.");
    } catch (err) {
      setError(err.message || "Unable to reserve your seat.");
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

      const result = await confirmAdmission(
        hold.holdId,
        studentId.trim()
      );

      setHold((previous) => ({
        ...previous,
        status: result.status,
      }));

      await refreshClass();

      setSuccess("Admission confirmed successfully!");
    } catch (err) {
      setError(err.message || "Unable to confirm admission.");

      // Refresh status in case the hold expired during confirmation.
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

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!schoolClass) {
    return (
      <div className="alert alert-error">
        {error || "Class not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admission Application</h1>
        <p className="mt-2 text-base-content/60">
          Reserve your seat and confirm your admission before the hold expires.
        </p>
      </div>

      {/* Class details */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{schoolClass.name}</h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-base-content/60">Total Seats</p>
              <p className="text-2xl font-bold">
                {schoolClass.totalSeats}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content/60">Held Seats</p>
              <p className="text-2xl font-bold text-warning">
                {schoolClass.heldSeats}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content/60">
                Confirmed Seats
              </p>
              <p className="text-2xl font-bold text-success">
                {schoolClass.confirmedSeats}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content/60">
                Available Seats
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
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
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
            <h2 className="card-title">Reserve Your Seat</h2>

            <label className="form-control w-full">
              <span className="label-text mb-2 font-medium">
                Student ID
              </span>

              <input
                type="text"
                placeholder="Enter your Student ID"
                className="input input-bordered w-full"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={submitting || schoolClass.availableSeats <= 0}
            >
              {submitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Reserve Seat"
              )}
            </button>

            {schoolClass.availableSeats <= 0 && (
              <p className="text-sm text-error">
                No seats are currently available.
              </p>
            )}
          </div>
        </form>
      )}

      {/* Hold information */}
      {hold && (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Admission Reservation</h2>

            <div className="space-y-3 text-sm">
              <p>
                <strong>Student ID:</strong> {hold.studentId || studentId}
              </p>

              <p>
                <strong>Hold ID:</strong> {hold.holdId}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    hold.status === "CONFIRMED"
                      ? "badge-success"
                      : hold.status === "HELD"
                      ? "badge-warning"
                      : "badge-error"
                  }`}
                >
                  {isExpired ? "EXPIRED" : hold.status}
                </span>
              </p>

              <p>
                <strong>Expires At:</strong>{" "}
                {new Date(hold.expiresAt).toLocaleString()}
              </p>
            </div>

            {hold.status === "HELD" && !isExpired && (
              <div className="mt-4 rounded-lg bg-warning/10 p-4 text-center">
                <p className="text-sm text-base-content/70">
                  Time remaining to confirm admission
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
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Pay Admission Fee"
                )}
              </button>
            )}

            {hold.status === "CONFIRMED" && (
              <div className="alert alert-success mt-4">
                Your admission has been confirmed.
              </div>
            )}

            {isExpired && (
              <div className="alert alert-error mt-4">
                Your reservation has expired. You can no longer confirm this hold.
              </div>
            )}

            {hold.status === "CANCELLED" && (
              <div className="alert alert-warning mt-4">
                This reservation has been cancelled.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}