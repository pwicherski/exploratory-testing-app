import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { jsPDF } from 'jspdf';

const NoteTakingApp = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ type: 'Note', content: '', app: 'None', os: 'None', env: 'None' });
  const [sessionName, setSessionName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('sessionId');
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [location]);

  const loadSession = (sessionId) => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setSessionName(session.name);
      setNotes(session.notes);
    }
  };

  const handleNoteChange = (e) => {
    setCurrentNote({ ...currentNote, [e.target.name]: e.target.value });
  };

  const addNote = () => {
    if (currentNote.content.trim()) {
      setNotes([...notes, { ...currentNote, id: Date.now() }]);
      setCurrentNote({ type: 'Note', content: '', app: 'None', os: 'None', env: 'None' });
    }
  };

  const saveSession = useCallback(() => {
    if (sessionName.trim()) {
      const session = {
        id: Date.now().toString(),
        name: sessionName,
        notes,
        date: new Date().toISOString()
      };
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      localStorage.setItem('sessions', JSON.stringify([...sessions, session]));
      toast.success("Session saved successfully");
      navigate('/sessions');
    } else {
      toast.error("Please enter a session name");
    }
  }, [sessionName, notes, navigate]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    doc.setFontSize(16);
    doc.text(sessionName, 10, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    notes.forEach((note, index) => {
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 10;
      }
      doc.text(`Note ${index + 1}: ${note.type}`, 10, yOffset);
      yOffset += 7;
      doc.text(`Content: ${note.content}`, 15, yOffset);
      yOffset += 7;
      doc.text(`App: ${note.app}, OS: ${note.os}, Env: ${note.env}`, 15, yOffset);
      yOffset += 10;
    });

    doc.save(`${sessionName}.pdf`);
    toast.success("Session exported to PDF");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exploratory Testing Session</h1>
      <Input
        type="text"
        placeholder="Session Name"
        value={sessionName}
        onChange={(e) => setSessionName(e.target.value)}
        className="mb-4"
      />
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Note</CardTitle>
        </CardHeader>
        <CardContent>
          <Select name="type" value={currentNote.type} onValueChange={(value) => handleNoteChange({ target: { name: 'type', value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select note type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Note">Note</SelectItem>
              <SelectItem value="Bug">Bug</SelectItem>
              <SelectItem value="Question">Question</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            name="content"
            placeholder="Note content"
            value={currentNote.content}
            onChange={handleNoteChange}
            className="mt-2"
          />
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Input name="app" placeholder="App" value={currentNote.app} onChange={handleNoteChange} />
            <Input name="os" placeholder="OS" value={currentNote.os} onChange={handleNoteChange} />
            <Input name="env" placeholder="Environment" value={currentNote.env} onChange={handleNoteChange} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addNote}>Add Note</Button>
        </CardFooter>
      </Card>
      <div className="space-y-4">
        {notes.map((note, index) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>{note.type} - Note {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{note.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                App: {note.app}, OS: {note.os}, Environment: {note.env}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 space-x-2">
        <Button onClick={saveSession}>Save Session</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Export to PDF</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Export Session to PDF</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to export this session to PDF?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={exportToPDF}>Export</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default NoteTakingApp;