import { createContext, useCallback, useContext, useState } from "react";

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


    // Admission page
    admissionApplication: "Admission Application",
    reserveAndConfirm: "Reserve your seat and confirm your admission before the hold expires.",
    totalSeatsLabel: "Total Seats",
    heldSeats: "Held Seats",
    confirmedSeats: "Confirmed Seats",
    availableSeatsLabel: "Available Seats",
    reserveYourSeat: "Reserve Your Seat",
    reserveSeat: "Reserve Seat",
    noSeatsAvailable: "No seats are currently available.",
    admissionReservation: "Admission Reservation",
    holdId: "Hold ID",
    status: "Status",
    expiresAt: "Expires At",
    timeRemaining: "Time remaining to confirm admission",
    payAdmissionFee: "Pay Admission Fee",
    admissionConfirmed: "Your admission has been confirmed.",
    reservationExpired: "Your reservation has expired. You can no longer confirm this hold.",
    reservationCancelled: "This reservation has been cancelled.",
    seatReserved: "Your seat has been temporarily reserved.",
    unableToLoadDetails: "Unable to load class details.",
    classNotFound: "Class not found.",
    enterStudentIdError: "Please enter a valid 17-digit Student ID.",
    unableToReserve: "Unable to reserve your seat.",
    unableToConfirm: "Unable to confirm admission.",

    
    viewHistory: "View your admission reservation history and application status.",
    viewApplications: "View Applications",
    applicationsFor: "Applications for",
    applications: "Applications",
    noApplications: "No Applications Found",
    noReservations: "You haven't made any admission reservations yet.",
    expirationTime: "Expiration Time",
    timeRemainingLabel: "Time remaining",
    cancelReservation: "Cancel Reservation",
    confirmCancel: "Are you sure you want to cancel this reservation?",
    admissionConfirmedMessage: "Admission confirmed successfully.",
    reservationExpiredMessage: "This reservation has expired.",
    reservationCancelledMessage: "This reservation has been cancelled.",
    unableToLoadApplications: "Unable to load applications.",
    unableToCancel: "Unable to cancel reservation.",
    enterStudentId: "Please enter a valid 17-digit Student ID.",
    valid: "Valid",
    invalid: "Invalid",

  },

  bn: {
    appName: "School Admission System",
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


    // Admission page
    admissionApplication: "ভর্তি আবেদন",
    reserveAndConfirm: "আসন সংরক্ষণ করুন এবং নির্ধারিত সময়ের মধ্যে ভর্তি নিশ্চিত করুন।",
    totalSeatsLabel: "মোট আসন",
    heldSeats: "সাময়িকভাবে সংরক্ষিত আসন",
    confirmedSeats: "নিশ্চিত আসন",
    availableSeatsLabel: "খালি আসন",
    reserveYourSeat: "আপনার আসন সংরক্ষণ করুন",
    reserveSeat: "আসন সংরক্ষণ করুন",
    noSeatsAvailable: "বর্তমানে কোনো আসন খালি নেই।",
    admissionReservation: "ভর্তি সংরক্ষণ",
    holdId: "সংরক্ষণ আইডি",
    status: "অবস্থা",
    expiresAt: "মেয়াদ শেষ হওয়ার সময়",
    timeRemaining: "ভর্তি নিশ্চিত করার বাকি সময়",
    payAdmissionFee: "ভর্তি ফি প্রদান করুন",
    admissionConfirmed: "আপনার ভর্তি নিশ্চিত হয়েছে।",
    reservationExpired: "আপনার আসন সংরক্ষণের মেয়াদ শেষ হয়েছে। এটি আর নিশ্চিত করা যাবে না।",
    reservationCancelled: "এই আসন সংরক্ষণ বাতিল করা হয়েছে।",
    seatReserved: "আপনার আসন সাময়িকভাবে সংরক্ষণ করা হয়েছে।",
    unableToLoadDetails: "শ্রেণির তথ্য লোড করা যায়নি।",
    classNotFound: "শ্রেণি খুঁজে পাওয়া যায়নি।",
    enterStudentIdError: "সঠিক ১৭ সংখ্যার শিক্ষার্থী নিবন্ধন নম্বর লিখুন।",
    unableToReserve: "আপনার আসন সংরক্ষণ করা যায়নি।",
    unableToConfirm: "ভর্তি নিশ্চিত করা যায়নি।",

    
    viewHistory: "আপনার ভর্তি সংরক্ষণের ইতিহাস এবং আবেদনের অবস্থা দেখুন।",
    viewApplications: "আবেদনসমূহ দেখুন",
    applicationsFor: "আবেদনসমূহ:",
    applications: "টি আবেদন",
    noApplications: "কোনো আবেদন পাওয়া যায়নি",
    noReservations: "আপনি এখনো কোনো ভর্তি সংরক্ষণ করেননি।",
    expirationTime: "মেয়াদ শেষ হওয়ার সময়",
    timeRemainingLabel: "বাকি সময়",
    cancelReservation: "সংরক্ষণ বাতিল করুন",
    confirmCancel: "আপনি কি নিশ্চিত যে এই সংরক্ষণ বাতিল করতে চান?",
    admissionConfirmedMessage: "ভর্তি সফলভাবে নিশ্চিত হয়েছে।",
    reservationExpiredMessage: "এই সংরক্ষণের মেয়াদ শেষ হয়েছে।",
    reservationCancelledMessage: "এই সংরক্ষণ বাতিল করা হয়েছে।",
    unableToLoadApplications: "আবেদনসমূহ লোড করা যায়নি।",
    unableToCancel: "সংরক্ষণ বাতিল করা যায়নি।",
    enterStudentId: "সঠিক ১৭ সংখ্যার শিক্ষার্থী নিবন্ধন নম্বর লিখুন।",
    valid: "সঠিক",
    invalid: "সঠিক নয়",

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

  const t = useCallback(
  (key) => translations[language]?.[key] ?? key,
  [language]
  );

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
