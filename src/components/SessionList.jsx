import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const fetchSessions = async () => {
  // TODO: Implement actual API call to Google Sheets
  return [
    { id: 1, name: "Session 1", date: "2024-03-15" },
    { id: 2, name: "Session 2", date: "2024-03-16" },
  ];
};

const SessionList = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  const handleNewSession = () => {
    navigate("/notes");
  };

  const handleOpenSession = (sessionId) => {
    // TODO: Implement opening a specific session
    console.log(`Opening session ${sessionId}`);
  };

  if (isLoading) return <div>Loading sessions...</div>;

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
              <p>Date: {session.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionList;