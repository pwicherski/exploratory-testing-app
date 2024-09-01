import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import SessionList from "./components/SessionList";
import NoteTakingApp from "./pages/NoteTakingApp";

const App = () => {
  return (
    <React.StrictMode>
      <TooltipProvider>
        <Toaster />
        <HashRouter>
          <Routes>
            <Route path="/" element={<SessionList />} />
            <Route path="/notes" element={<NoteTakingApp />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </React.StrictMode>
  );
};

export default App;
