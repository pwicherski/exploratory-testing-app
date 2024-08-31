import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SessionList = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importedSessions, setImportedSessions] = useState([]);

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

  const handleImportDialogOpen = () => {
    setIsImportDialogOpen(true);
  };

  const handleImportDialogClose = () => {
    setIsImportDialogOpen(false);
    setImportFile(null);
    setImportedSessions([]);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setImportFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (!Array.isArray(importedData)) {
            throw new Error("Invalid import format");
          }
          setImportedSessions(importedData);
        } catch (error) {
          console.error("Import error:", error);
          toast.error("Error reading import file: " + error.message);
          setImportFile(null);
          setImportedSessions([]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportConfirm = () => {
    if (importedSessions.length > 0) {
      setSessions(prevSessions => {
        const updatedSessions = [
          ...prevSessions,
          ...importedSessions.map(session => ({
            ...session,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date(session.date).toISOString(),
            notes: session.notes.map(note => ({
              ...note,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }))
          }))
        ];
        localStorage.setItem('sessions', JSON.stringify(updatedSessions));
        return updatedSessions;
      });
      toast.success(`${importedSessions.length} sessions imported successfully`);
      handleImportDialogClose();
    } else {
      toast.error("No valid sessions to import");
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
        <Button variant="outline" onClick={handleImportDialogOpen}>Import Sessions</Button>
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
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Sessions</DialogTitle>
            <DialogDescription>
              Select a JSON file to import sessions. This will add to your existing sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="importFile">Session File</Label>
            <Input id="importFile" type="file" accept=".json" onChange={handleFileSelect} />
          </div>
          {importedSessions.length > 0 && (
            <p>{importedSessions.length} sessions found in the file</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleImportDialogClose}>Cancel</Button>
            <Button onClick={handleImportConfirm} disabled={importedSessions.length === 0}>
              Import {importedSessions.length} Sessions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionList;
