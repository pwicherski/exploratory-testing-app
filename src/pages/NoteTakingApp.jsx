import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const NoteTakingApp = () => {
  const [sessionName, setSessionName] = useState('');
  const [newNote, setNewNote] = useState({ type: 'Note', content: '' });
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
      setNewNote({ type: 'Note', content: '' });
    },
  });

  const saveSessionMutation = useMutation({
    mutationFn: saveSession,
    onSuccess: () => {
      // Handle successful save
    },
  });

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
          <Button onClick={() => saveSessionMutation.mutate({ name: sessionName, notes })}>
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
              <Button onClick={() => addNoteMutation.mutate(newNote)}>Add</Button>
              <Button variant="outline">Clear</Button>
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

// These functions would need to be implemented to interact with your backend
const fetchNotes = async () => {
  // Fetch notes from the backend
  return [];
};

const addNote = async (note) => {
  // Add a note to the backend
};

const saveSession = async ({ name, notes }) => {
  // Save the session to the backend
};

export default NoteTakingApp;