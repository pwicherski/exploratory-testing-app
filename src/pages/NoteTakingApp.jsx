import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const NoteTakingApp = () => {
  const [sessionName, setSessionName] = useState('');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ type: 'Note', content: '', app: 'UCL', os: 'Android', env: 'PROD' });
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('sessionId');
    if (sessionId) {
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      const session = sessions.find(s => s.id === parseInt(sessionId));
      if (session) {
        setSessionName(session.name);
        setNotes(session.notes);
      }
    }
  }, [location]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleAddNote = () => {
    if (newNote.content.trim()) {
      const updatedNotes = [...notes, { ...newNote, id: Date.now() }];
      setNotes(updatedNotes);
      setNewNote({ ...newNote, content: '' });
      toast.success("Note added successfully");
    } else {
      toast.error("Note content cannot be empty");
    }
  };

  const handleClearNote = () => {
    setNewNote({ ...newNote, content: '' });
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    toast.success("Note deleted successfully");
  };

  const handleSaveSession = () => {
    if (sessionName.trim()) {
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      const newSession = {
        id: Date.now(),
        name: sessionName,
        notes: notes,
        date: new Date().toISOString(),
        duration: timer
      };
      localStorage.setItem('sessions', JSON.stringify([...sessions, newSession]));
      toast.success("Session saved successfully");
      navigate('/');
    } else {
      toast.error("Session name cannot be empty");
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Test session name"
            className="w-64"
          />
          <Button onClick={handleSaveSession}>
            Save Session
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xl font-bold">{formatTime(timer)}</div>
          <Button onClick={() => setIsTimerRunning(!isTimerRunning)}>
            {isTimerRunning ? 'Pause' : 'Start'}
          </Button>
          <Button variant="outline" onClick={handleClose}>Close</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Add note or result"
              className="mb-2"
            />
            <div className="flex space-x-2 mb-2">
              <Select
                value={newNote.type}
                onValueChange={(value) => setNewNote({ ...newNote, type: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Note type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Note">Note</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Retest">Retest</SelectItem>
                  <SelectItem value="Question">Question</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newNote.app}
                onValueChange={(value) => setNewNote({ ...newNote, app: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="App" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UCL">UCL</SelectItem>
                  <SelectItem value="UEL">UEL</SelectItem>
                  <SelectItem value="UECL">UECL</SelectItem>
                  <SelectItem value="UWCL">UWCL</SelectItem>
                  <SelectItem value="NTC">NTC</SelectItem>
                  <SelectItem value="PH">PH</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newNote.os}
                onValueChange={(value) => setNewNote({ ...newNote, os: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Android">Android</SelectItem>
                  <SelectItem value="iOS">iOS</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newNote.env}
                onValueChange={(value) => setNewNote({ ...newNote, env: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROD">PROD</SelectItem>
                  <SelectItem value="PRE">PRE</SelectItem>
                  <SelectItem value="INT">INT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddNote}>Add</Button>
              <Button variant="outline" onClick={handleClearNote}>Clear</Button>
            </div>
          </div>

          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardContent className="flex items-start space-x-4 p-4">
                  <div className={`w-4 h-4 rounded-full ${getColorForNoteType(note.type)}`} />
                  <div className="flex-grow">
                    <p className="font-semibold">{note.type}</p>
                    <p>{note.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      App: {note.app} | OS: {note.os} | Env: {note.env}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this note? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getColorForNoteType = (type) => {
  switch (type) {
    case 'Failed': return 'bg-red-500';
    case 'Retest': return 'bg-yellow-500';
    case 'Question': return 'bg-blue-500';
    default: return 'bg-green-500';
  }
};

export default NoteTakingApp;
