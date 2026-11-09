import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ClassesPage from "../features/classes/pages/ClassesPage";
import AdmissionPage from "../features/admissions/pages/AdmissionPage";
import MyApplicationsPage from "../features/applications/pages/MyApplicationsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ClassesPage />,
      },
      {
        path: "admission/:classId",
        element: <AdmissionPage />,
      },
      {
        path: "my-applications",
        element: <MyApplicationsPage />,
      },
    ],
  },
]);