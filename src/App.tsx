import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DataSiswa from "./pages/DataSiswa";
import InputNilai from "./pages/InputNilai";
import Prediksi from "./pages/Prediksi";
import Preprocessing from "./pages/Preprocessing";
import Statistik from "./pages/Statistik";
import KelolaGuru from "./pages/KelolaGuru";
import Tutorial from "./pages/Tutorial";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/siswa" element={<DataSiswa />} />
            <Route path="/nilai" element={<InputNilai />} />
            <Route path="/prediksi" element={<Prediksi />} />
            <Route path="/preprocessing" element={<Preprocessing />} />
            <Route path="/statistik" element={<Statistik />} />
            <Route path="/guru" element={<KelolaGuru />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
