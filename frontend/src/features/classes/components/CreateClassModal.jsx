import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";

export default function CreateClassModal({
  isOpen,
  onClose,
  onCreate,
  submitting,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      totalSeats: 30,
    },
  });

  const submitHandler = async (data) => {
    const success = await onCreate({
      name: data.name.trim(),
      totalSeats: Number(data.totalSeats),
    });

    if (success) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Create New Class</h3>
            <p className="mt-1 text-sm text-base-content/60">
              Add a class and configure its admission capacity.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Class name</span>
            </label>

            <input
              type="text"
              placeholder="Example: Class One"
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
              {...register("name", {
                required: "Class name is required.",
                minLength: {
                  value: 2,
                  message: "Minimum 2 characters required.",
                },
                maxLength: {
                  value: 150,
                  message: "Maximum 150 characters allowed.",
                },
              })}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-error">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Total seats</span>
            </label>

            <input
              type="number"
              min="1"
              max="10000"
              className={`input input-bordered w-full ${
                errors.totalSeats ? "input-error" : ""
              }`}
              {...register("totalSeats", {
                required: "Seat capacity is required.",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "At least one seat is required.",
                },
                max: {
                  value: 10000,
                  message: "Maximum 10,000 seats allowed.",
                },
              })}
            />

            {errors.totalSeats && (
              <p className="mt-1 text-sm text-error">
                {errors.totalSeats.message}
              </p>
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating...
                </>
              ) : (
                "Create Class"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onClose}>
        <button type="button">Close</button>
      </div>
    </div>
  );
}