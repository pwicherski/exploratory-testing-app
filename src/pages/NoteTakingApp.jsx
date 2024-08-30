import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock data storage
let mockNotes = [];
let mockSessions = [];

const NoteTakingApp = () => {
  const [sessionName, setSessionName] = useState('');
  const [newNote, setNewNote] = useState({ type: 'Note', content: '' });
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    initialData: [],
  });

  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: (addedNote) => {
      queryClient.setQueryData(['notes'], (oldNotes) => [...oldNotes, addedNote]);
      setNewNote({ type: 'Note', content: '' });
      toast.success("Note added successfully");
    },
  });

  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData) => {
      const response = await fetch('/api/save-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) {
        throw new Error('Failed to save session');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Session saved successfully");
      queryClient.invalidateQueries(['sessions']);
    },
    onError: (error) => {
      toast.error(`Error saving session: ${error.message}`);
    },
  });

  const handleAddNote = () => {
    if (newNote.content.trim()) {
      addNoteMutation.mutate(newNote);
    } else {
      toast.error("Note content cannot be empty");
    }
  };

  const handleClearNote = () => {
    setNewNote({ type: 'Note', content: '' });
  };

  const handleSaveSession = () => {
    if (sessionName.trim()) {
      saveSessionMutation.mutate({ name: sessionName, notes });
    } else {
      toast.error("Session name cannot be empty");
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
          <Button variant="outline">Close</Button>
          <Button variant="outline" className="ml-2">Edit</Button>
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
            {notes.map((note, index) => (
              <Card key={index}>
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

// Mock backend functions
const fetchNotes = async () => {
  return mockNotes;
};

const addNote = async (note) => {
  const newNote = { ...note, id: Date.now() };
  mockNotes.push(newNote);
  return newNote;
};

const saveSession = async ({ name, notes }) => {
  const session = { id: Date.now(), name, notes };
  mockSessions.push(session);
  return session;
};

export default NoteTakingApp;
