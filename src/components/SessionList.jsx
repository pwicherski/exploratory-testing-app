import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const SessionList = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    setSessions(storedSessions);
  }, []);

  const handleNewSession = () => {
    navigate("/notes");
  };

  const handleOpenSession = (sessionId) => {
    navigate(`/notes?sessionId=${sessionId}`);
  };

  const handleDeleteSession = (sessionId) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    toast.success("Session deleted successfully");
  };

  const handleExportSessions = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sessions_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Sessions exported successfully");
  };

  const handleImportSessions = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSessions = JSON.parse(e.target.result);
          if (!Array.isArray(importedSessions)) {
            throw new Error("Invalid import format");
          }
          setSessions(prevSessions => {
            const updatedSessions = [
              ...prevSessions,
              ...importedSessions.map(session => ({
                ...session,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique string IDs
                date: new Date(session.date).toISOString(), // Ensure valid date
                notes: session.notes.map(note => ({
                  ...note,
                  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Ensure unique string IDs for notes
                }))
              }))
            ];
            localStorage.setItem('sessions', JSON.stringify(updatedSessions));
            return updatedSessions;
          });
          toast.success(`${importedSessions.length} sessions imported successfully`);
        } catch (error) {
          console.error("Import error:", error);
          toast.error("Error importing sessions: " + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Sessions</h1>
      <div className="flex space-x-2 mb-4">
        <Button onClick={handleNewSession}>New Session</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Export All Sessions</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Export Sessions</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to export all sessions?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExportSessions}>Export</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Import Sessions</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Import Sessions</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to import sessions? This will add to your existing sessions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <label className="cursor-pointer">
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSessions}
                    className="hidden"
                  />
                </label>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Date: {new Date(session.date).toLocaleDateString()}</p>
              <p>Notes: {session.notes.length}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => handleOpenSession(session.id)}>Open</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Session</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this session? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteSession(session.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionList;
