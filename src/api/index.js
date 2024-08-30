// This file would typically be on the server-side, but for this example, we'll use mock data

let mockSessions = [];

export const fetchSessions = async () => {
  // In a real application, this would fetch data from Google Sheets
  return mockSessions;
};

export const saveSession = async (sessionData) => {
  // In a real application, this would save data to Google Sheets
  const newSession = {
    id: Date.now(),
    ...sessionData,
    date: new Date().toISOString(),
    noteCount: sessionData.notes.length,
  };
  mockSessions.push(newSession);
  return newSession;
};