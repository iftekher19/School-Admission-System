import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaGraduationCap, FaSyncAlt } from "react-icons/fa";

import {
  createClass,
  getClasses,
} from "../services/classService";

import ClassCard from "../components/ClassCard";
import CreateClassModal from "../components/CreateClassModal";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadClasses = useCallback(async () => {
    try {
      setError("");
      const data = await getClasses();
      setClasses(data);
    } catch (err) {
      setError(err.message || "Unable to load classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleCreateClass = async (data) => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createClass(data);

      setSuccess("Class created successfully.");
      await loadClasses();

      return true;
    } catch (err) {
      setError(err.message || "Unable to create class.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const totalSeats = classes.reduce(
    (sum, item) => sum + item.totalSeats,
    0
  );

  const availableSeats = classes.reduce(
    (sum, item) => sum + item.availableSeats,
    0
  );

  const confirmedSeats = classes.reduce(
    (sum, item) => sum + item.confirmedSeats,
    0
  );

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <FaGraduationCap />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Admission Management
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Class Management
          </h1>

          <p className="mt-2 text-base-content/60">
            Manage classes and monitor admission availability.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setSuccess("");
            setIsModalOpen(true);
          }}
        >
          <FaPlus /> Create Class
        </button>
      </section>

      {/* Feedback */}
      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {success && (
        <div role="status" className="alert alert-success">
          {success}
        </div>
      )}

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Classes"
          value={classes.length}
          description="Registered classes"
        />

        <SummaryCard
          title="Total Capacity"
          value={totalSeats}
          description="Available admission capacity"
        />

        <SummaryCard
          title="Confirmed Admissions"
          value={confirmedSeats}
          description={`${availableSeats} seats currently available`}
        />
      </section>

      {/* Class list */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Available Classes</h2>
            <p className="text-sm text-base-content/60">
              Browse classes and their seat availability.
            </p>
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={loadClasses}
            disabled={loading}
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : classes.length === 0 ? (
          <div className="card border border-dashed border-base-300 bg-base-100">
            <div className="card-body items-center py-16 text-center">
              <FaGraduationCap className="text-4xl text-base-content/30" />
              <h3 className="text-lg font-bold">No classes yet</h3>
              <p className="text-sm text-base-content/60">
                Create your first class to start accepting applications.
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus /> Create Class
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((schoolClass) => (
              <ClassCard
                key={schoolClass.id}
                schoolClass={schoolClass}
              />
            ))}
          </div>
        )}
      </section>

      <CreateClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateClass}
        submitting={submitting}
      />
    </div>
  );
}

function SummaryCard({ title, value, description }) {
  return (
    <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
      <div className="stat-title">{title}</div>
      <div className="stat-value text-primary">{value}</div>
      <div className="stat-desc">{description}</div>
    </div>
  );
}