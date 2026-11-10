
import { createContext, useContext, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    appName: "School Admission System",
    myApplications: "My Applications",
    studentId: "Student Registration Number",
    enterStudentId: "Enter your 17-digit registration number",
    switchLanguage: "বাংলা",

    admissionManagement: "Admission Management",
    classManagement: "Class Management",
    manageClasses: "Manage classes and monitor admission availability.",
    createClass: "Create Class",
    totalClasses: "Total Classes",
    registeredClasses: "Registered classes",
    totalCapacity: "Total Capacity",
    admissionCapacity: "Available admission capacity",
    confirmedAdmissions: "Confirmed Admissions",
    seatsAvailable: "seats currently available",
    availableClasses: "Available Classes",
    browseClasses: "Browse classes and their seat availability.",
    refresh: "Refresh",
    loading: "Loading...",
    noClasses: "No classes yet",
    createFirstClass: "Create your first class to start accepting applications.",
    classCreated: "Class created successfully.",
    unableToLoad: "Unable to load classes.",
    unableToCreate: "Unable to create class.",
    dismiss: "Dismiss",

    availability: "Admission availability",
    open: "Open",
    full: "Full",
    total: "Total",
    held: "Held",
    confirmed: "Confirmed",
    seatOccupancy: "Seat occupancy",
    availableSeats: "Available seats",
    applyNow: "Apply Now",

    createNewClass: "Create New Class",
    configureCapacity: "Add a class and configure its admission capacity.",
    className: "Class name",
    classNamePlaceholder: "Example: Class One",
    totalSeats: "Total seats",
    classNameRequired: "Class name is required.",
    minCharacters: "Minimum 2 characters required.",
    maxCharacters: "Maximum 150 characters allowed.",
    seatCapacityRequired: "Seat capacity is required.",
    atLeastOneSeat: "At least one seat is required.",
    maxSeats: "Maximum 10,000 seats allowed.",
    cancel: "Cancel",
    creating: "Creating...",
    close: "Close",
  },

  bn: {
    appName: "স্কুল ভর্তি ব্যবস্থা",
    myApplications: "আমার আবেদনসমূহ",
    studentId: "শিক্ষার্থীর নিবন্ধন নম্বর",
    enterStudentId: "আপনার ১৭ সংখ্যার নিবন্ধন নম্বর লিখুন",
    switchLanguage: "English",

    admissionManagement: "ভর্তি ব্যবস্থাপনা",
    classManagement: "শ্রেণি ব্যবস্থাপনা",
    manageClasses: "শ্রেণিসমূহ পরিচালনা করুন এবং ভর্তির আসন পর্যবেক্ষণ করুন।",
    createClass: "শ্রেণি তৈরি করুন",
    totalClasses: "মোট শ্রেণি",
    registeredClasses: "নিবন্ধিত শ্রেণিসমূহ",
    totalCapacity: "মোট আসন সংখ্যা",
    admissionCapacity: "ভর্তির জন্য মোট আসন",
    confirmedAdmissions: "নিশ্চিত ভর্তি",
    seatsAvailable: "টি আসন বর্তমানে খালি আছে",
    availableClasses: "ভর্তিযোগ্য শ্রেণিসমূহ",
    browseClasses: "শ্রেণিসমূহ এবং আসনের অবস্থা দেখুন।",
    refresh: "রিফ্রেশ",
    loading: "লোড হচ্ছে...",
    noClasses: "এখনো কোনো শ্রেণি নেই",
    createFirstClass: "ভর্তি কার্যক্রম শুরু করতে প্রথম শ্রেণিটি তৈরি করুন।",
    classCreated: "শ্রেণি সফলভাবে তৈরি হয়েছে।",
    unableToLoad: "শ্রেণিসমূহ লোড করা যায়নি।",
    unableToCreate: "শ্রেণি তৈরি করা যায়নি।",
    dismiss: "বন্ধ করুন",

    availability: "ভর্তির অবস্থা",
    open: "আসন খালি আছে",
    full: "আসন পূর্ণ",
    total: "মোট",
    held: "সাময়িকভাবে সংরক্ষিত",
    confirmed: "নিশ্চিত",
    seatOccupancy: "আসন ব্যবহারের হার",
    availableSeats: "খালি আসন",
    applyNow: "আবেদন করুন",

    createNewClass: "নতুন শ্রেণি তৈরি করুন",
    configureCapacity: "একটি শ্রেণি যোগ করুন এবং আসন সংখ্যা নির্ধারণ করুন।",
    className: "শ্রেণির নাম",
    classNamePlaceholder: "উদাহরণ: প্রথম শ্রেণি",
    totalSeats: "মোট আসন",
    classNameRequired: "শ্রেণির নাম আবশ্যক।",
    minCharacters: "কমপক্ষে ২টি অক্ষর লিখুন।",
    maxCharacters: "সর্বোচ্চ ১৫০টি অক্ষর লেখা যাবে।",
    seatCapacityRequired: "আসন সংখ্যা আবশ্যক।",
    atLeastOneSeat: "কমপক্ষে ১টি আসন থাকতে হবে।",
    maxSeats: "সর্বোচ্চ ১০,০০০টি আসন দেওয়া যাবে।",
    cancel: "বাতিল",
    creating: "তৈরি হচ্ছে...",
    close: "বন্ধ করুন",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const toggleLanguage = () => {
    const nextLanguage = language === "en" ? "bn" : "en";
    setLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  };

  const t = (key) => translations[language]?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
