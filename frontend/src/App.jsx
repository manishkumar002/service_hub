import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import WaterBubbleCursor from "./components/WaterBubbleCursor"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import CreateJob from "./pages/CreateJob";
import MyPostedJobs from "./pages/MyPostedJobs";
import MyAppliedJobs from "./pages/MyAppliedJobs";
import Categories from "./pages/Categories";
import AdminCategories from "./pages/AdminCategories";
import Chat from "./pages/Chat";
import Subscription from "./pages/Subscription";
import ApplicationsInbox from "./pages/ApplicationsInbox";

function App() {
  return (
    <>
     <WaterBubbleCursor /> 
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route
            path="profile"
            element={
              <ProtectedRoute roles={["client", "provider"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs/create"
            element={
              <ProtectedRoute roles={["client"]}>
                <CreateJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs/edit/:id"
            element={
              <ProtectedRoute roles={["client"]}>
                <CreateJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs/my-posted"
            element={
              <ProtectedRoute roles={["client"]}>
                <MyPostedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="applications"
            element={
              <ProtectedRoute roles={["client"]}>
                <ApplicationsInbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs/my-applied"
            element={
              <ProtectedRoute roles={["provider"]}>
                <MyAppliedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs"
            element={
              <ProtectedRoute roles={["client", "provider", "admin"]}>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs/:id"
            element={
              <ProtectedRoute roles={["client", "provider", "admin"]}>
                <JobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="categories"
            element={
              <ProtectedRoute roles={["client", "provider", "admin"]}>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/categories"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="chat"
            element={
              <ProtectedRoute roles={["client", "provider"]}>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="subscription"
            element={
              <ProtectedRoute roles={["provider"]}>
                <Subscription />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
