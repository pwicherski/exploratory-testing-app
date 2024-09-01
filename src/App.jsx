import React from 'react';
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import SessionList from "./components/SessionList";
import NoteTakingApp from "./pages/NoteTakingApp";
import Index from "./pages/Index";

const App = () => {
  return (
    <React.StrictMode>
      <TooltipProvider>
        <Toaster />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sessions" element={<SessionList />} />
            <Route path="/notes" element={<NoteTakingApp />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </React.StrictMode>
  );
};

export default App;