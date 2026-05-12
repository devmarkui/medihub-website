import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Travels from "./pages/Travels";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { AdminDataProvider } from "@/contexts/AdminDataContext";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAnnouncement from "@/pages/admin/AdminAnnouncement";
import AdminDoctors from "@/pages/admin/AdminDoctors";
import RequireAuth from "@/pages/admin/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/travels" element={<Travels />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin (separate layout, hidden from public navigation) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/announcement" element={<AdminAnnouncement />} />
              <Route path="/admin/doctors" element={<AdminDoctors />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
