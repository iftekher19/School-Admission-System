
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";

import { useLanguage } from "../../../app/LanguageContext";

export default function CreateClassModal({
  isOpen,
  onClose,
  onCreate,
  submitting,
}) {
  const { t } = useLanguage();

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
            <h3 className="text-xl font-bold">
              {t("createNewClass")}
            </h3>
            <p className="mt-1 text-sm text-base-content/60">
              {t("configureCapacity")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm"
            aria-label={t("close")}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                {t("className")}
              </span>
            </label>

            <input
              type="text"
              placeholder={t("classNamePlaceholder")}
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
              {...register("name", {
                required: t("classNameRequired"),
                minLength: {
                  value: 2,
                  message: t("minCharacters"),
                },
                maxLength: {
                  value: 150,
                  message: t("maxCharacters"),
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
              <span className="label-text font-semibold">
                {t("totalSeats")}
              </span>
            </label>

            <input
              type="number"
              min="1"
              max="10000"
              className={`input input-bordered w-full ${
                errors.totalSeats ? "input-error" : ""
              }`}
              {...register("totalSeats", {
                required: t("seatCapacityRequired"),
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: t("atLeastOneSeat"),
                },
                max: {
                  value: 10000,
                  message: t("maxSeats"),
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
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  {t("creating")}
                </>
              ) : (
                t("createClass")
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onClose}>
        <button type="button">{t("close")}</button>
      </div>
    </div>
  );
}
