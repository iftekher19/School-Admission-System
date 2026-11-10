
import { useStudent } from "../../app/StudentContext";
import { useLanguage } from "../../app/LanguageContext";

export default function StudentIdentity() {
  const { studentId, updateStudentId, isValidStudentId } = useStudent();
  const { language, t } = useLanguage();

  return (
    <section className="mb-6 rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">
          {language === "en"
            ? "Student Identification"
            : "শিক্ষার্থী পরিচিতি"}
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          {language === "en"
            ? "Enter your 17-digit student registration number to continue."
            : "চালিয়ে যেতে আপনার ১৭ সংখ্যার শিক্ষার্থী নিবন্ধন নম্বর লিখুন।"}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]{17}"
          maxLength={17}
          minLength={17}
          placeholder={t("enterStudentId")}
          className="input input-bordered w-full sm:max-w-md"
          value={studentId}
          onChange={(event) => updateStudentId(event.target.value)}
          aria-label={t("studentId")}
        />

        <span
          className={`badge self-start sm:self-center ${
            isValidStudentId ? "badge-success" : "badge-warning"
          }`}
        >
          {isValidStudentId
            ? language === "en" ? "Valid ID" : "সঠিক আইডি"
            : language === "en"
              ? `${studentId.length}/17 digits`
              : `${studentId.length}/১৭ সংখ্যা`}
        </span>
      </div>
    </section>
  );
}
