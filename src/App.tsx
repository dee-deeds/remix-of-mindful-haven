import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Counselors from "./pages/Counselors";
import Assessment from "./pages/Assessment";
import Community from "./pages/Community";
import Booking from "./pages/Booking";
import Emergency from "./pages/Emergency";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/counselors" element={<Counselors />} />
                <Route path="/community" element={<Community />} />
                <Route path="/events" element={<Events />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <ChatBot />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
