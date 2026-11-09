import { useCallback, useEffect, useState } from "react";
import { getMyApplications, cancelApplication } from "../services/applicationService";

export default function MyApplicationsPage() {
  const [studentId, setStudentId] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  const loadApplications = useCallback(async (id) => {
    try {
      const data = await getMyApplications(id);
      setApplications(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load applications.");
    }
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    const id = studentId.trim();

    if (!id) {
      setError("Please enter your Student ID.");
      return;
    }

    setLoading(true);
    setError("");
    setSearchedId(id);

    await loadApplications(id);

    setLoading(false);
  };

  // Refresh application statuses periodically.
  useEffect(() => {
    if (!searchedId) return;

    const interval = setInterval(() => {
      loadApplications(searchedId);
    }, 5000);

    return () => clearInterval(interval);
  }, [searchedId, loadApplications]);

  // Update countdown every second.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (holdId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) return;

    try {
      await cancelApplication(holdId, searchedId);
      await loadApplications(searchedId);
    } catch (err) {
      setError(err.message || "Unable to cancel reservation.");
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

  const getStatusBadge = (status) => {
    const styles = {
      HELD: "badge-warning",
      CONFIRMED: "badge-success",
      EXPIRED: "badge-error",
      CANCELLED: "badge-neutral",
    };

    return (
      <span className={`badge ${styles[status] || "badge-ghost"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="mt-2 text-base-content/60">
          View your admission reservation history and application status.
        </p>
      </div>

      {/* Student ID search */}
      <form
        onSubmit={handleSearch}
        className="card border border-base-300 bg-base-100 shadow-sm"
      >
        <div className="card-body">
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
            className="btn btn-primary mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "View Applications"
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Application history */}
      {searchedId && !loading && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">
              Applications for {searchedId}
            </h2>

            <span className="badge badge-outline">
              {applications.length} Applications
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body items-center text-center">
                <h3 className="text-lg font-semibold">
                  No Applications Found
                </h3>
                <p className="text-base-content/60">
                  You haven't made any admission reservations yet.
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
                            Hold ID: {application.holdId}
                          </p>
                        </div>

                        {getStatusBadge(status)}
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-base-content/60">
                            Student ID
                          </p>
                          <p className="font-medium">
                            {searchedId}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-base-content/60">
                            Expiration Time
                          </p>
                          <p className="font-medium">
                            {new Date(application.expiresAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {status === "HELD" && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-warning/10 p-3">
                          <div>
                            <p className="text-sm text-base-content/60">
                              Time remaining
                            </p>
                            <p className="text-xl font-bold tabular-nums">
                              {formatTime(application.expiresAt)}
                            </p>
                          </div>

                          <button
                            className="btn btn-outline btn-error btn-sm"
                            onClick={() =>
                              handleCancel(application.holdId)
                            }
                          >
                            Cancel Reservation
                          </button>
                        </div>
                      )}

                      {status === "CONFIRMED" && (
                        <div className="alert alert-success mt-3">
                          Admission confirmed successfully.
                        </div>
                      )}

                      {status === "EXPIRED" && (
                        <div className="alert alert-error mt-3">
                          This reservation has expired.
                        </div>
                      )}

                      {status === "CANCELLED" && (
                        <div className="alert alert-warning mt-3">
                          This reservation has been cancelled.
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