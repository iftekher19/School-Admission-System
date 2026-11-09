import { createContext, useContext, useState } from "react";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [studentId, setStudentId] = useState(
    () => localStorage.getItem("studentId") || ""
  );

  const updateStudentId = (value) => {
    // Only allow numeric characters and a maximum of 17 digits.
    const cleanValue = value.replace(/\D/g, "").slice(0, 17);

    setStudentId(cleanValue);
    localStorage.setItem("studentId", cleanValue);
  };

  const isValidStudentId = /^\d{17}$/.test(studentId);

  return (
    <StudentContext.Provider
      value={{ studentId, updateStudentId, isValidStudentId }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);

  if (!context) {
    throw new Error("useStudent must be used inside StudentProvider");
  }

  return context;
}