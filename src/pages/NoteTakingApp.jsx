import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const NoteTakingApp = () => {
  const [sessionName, setSessionName] = useState('');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ type: 'Note', content: '' });
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

  const handleAddNote = () => {
    if (newNote.content.trim()) {
      const updatedNotes = [...notes, { ...newNote, id: Date.now() }];
      setNotes(updatedNotes);
      setNewNote({ type: 'Note', content: '' });
      toast.success("Note added successfully");
    } else {
      toast.error("Note content cannot be empty");
    }
  };

  const handleClearNote = () => {
    setNewNote({ type: 'Note', content: '' });
  };

  const handleSaveSession = () => {
    if (sessionName.trim()) {
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      const newSession = {
        id: Date.now(),
        name: sessionName,
        notes: notes,
        date: new Date().toISOString()
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
        <div>
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
            <div className="flex space-x-2">
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
              <Button onClick={handleAddNote}>Add</Button>
              <Button variant="outline" onClick={handleClearNote}>Clear</Button>
            </div>
          </div>

          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardContent className="flex items-start space-x-4 p-4">
                  <div className={`w-4 h-4 rounded-full ${getColorForNoteType(note.type)}`} />
                  <div>
                    <p className="font-semibold">{note.type}</p>
                    <p>{note.content}</p>
                  </div>
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
