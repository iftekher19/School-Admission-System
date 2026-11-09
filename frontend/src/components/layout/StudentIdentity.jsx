import { useStudent } from "../../app/StudentContext";

export default function StudentIdentity() {
  const { studentId, updateStudentId, isValidStudentId } = useStudent();

  return (
    <section className="mb-6 rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">
          Student Identification
        </h2>
        <p className="mt-1 text-sm text-base-content/60">
          Enter your 17-digit student registration number to continue.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]{17}"
          maxLength={17}
          minLength={17}
          placeholder="Enter 17-digit registration number"
          className="input input-bordered w-full sm:max-w-md"
          value={studentId}
          onChange={(event) => updateStudentId(event.target.value)}
          aria-label="17-digit student registration number"
        />

        <span
          className={`badge self-start sm:self-center ${
            isValidStudentId ? "badge-success" : "badge-warning"
          }`}
        >
          {isValidStudentId ? "Valid ID" : `${studentId.length}/17 digits`}
        </span>
      </div>
    </section>
  );
}