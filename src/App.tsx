import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { PublicLayout } from "@/components/PublicLayout";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Counselors from "./pages/Counselors";
import Assessment from "./pages/Assessment";
import Community from "./pages/Community";
import Booking from "./pages/Booking";
import Emergency from "./pages/Emergency";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes — blog-like with top Navbar + Footer */}
            <Route element={<PublicLayout />}>
              <Route index element={<Index />} />
              <Route path="resources" element={<Resources />} />
              <Route path="counselors" element={<Counselors />} />
              <Route path="community" element={<Community />} />
              <Route path="events" element={<Events />} />
              <Route path="emergency" element={<Emergency />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>

            {/* Dashboard routes — personalized sidebar layout, all protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="dashboard/assessment" element={<Assessment />} />
                <Route path="dashboard/booking" element={<Booking />} />
                <Route path="dashboard/resources" element={<Resources />} />
                <Route path="dashboard/counselors" element={<Counselors />} />
                <Route path="dashboard/community" element={<Community />} />
                <Route path="dashboard/events" element={<Events />} />
                <Route path="dashboard/emergency" element={<Emergency />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route element={<PublicLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
