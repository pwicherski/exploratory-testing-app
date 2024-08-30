import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const fetchSessions = async () => {
  // TODO: Implement actual API call to Google Sheets
  const response = await fetch('/api/sessions');
  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }
  return response.json();
};

const SessionList = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  const handleNewSession = () => {
    navigate("/notes");
  };

  const handleOpenSession = (sessionId) => {
    navigate(`/notes?sessionId=${sessionId}`);
  };

  if (isLoading) return <div>Loading sessions...</div>;
  if (error) return <div>Error loading sessions: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Sessions</h1>
      <Button onClick={handleNewSession} className="mb-4">
        New Session
      </Button>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleOpenSession(session.id)}>
            <CardHeader>
              <CardTitle>{session.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Date: {new Date(session.date).toLocaleDateString()}</p>
              <p>Notes: {session.noteCount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionList;
