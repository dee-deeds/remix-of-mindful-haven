import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Counselors from "./pages/Counselors";
import Assessment from "./pages/Assessment";
import Community from "./pages/Community";
import Booking from "./pages/Booking";
import Emergency from "./pages/Emergency";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/counselors" element={<Counselors />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/community" element={<Community />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
