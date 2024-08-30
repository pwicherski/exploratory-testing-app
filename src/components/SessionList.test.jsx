import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SessionList from './SessionList';
import { toast } from 'sonner';

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('SessionList', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <SessionList />
    </BrowserRouter>
  );

  const simulateFileUpload = (content) => {
    const file = new File([JSON.stringify(content)], 'sessions.json', { type: 'application/json' });
    const fileInput = screen.getByLabelText('Import');
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);
  };

  test('imports sessions successfully', async () => {
    renderComponent();
    
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const validSessions = [
      { id: 1, name: 'Test Session 1', date: '2023-01-01T00:00:00.000Z', notes: [] },
      { id: 2, name: 'Test Session 2', date: '2023-01-02T00:00:00.000Z', notes: [] }
    ];
    
    simulateFileUpload(validSessions);
    
    const confirmImportButton = screen.getByText('Import');
    fireEvent.click(confirmImportButton);
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('2 sessions imported successfully');
      expect(screen.getByText('Test Session 1')).toBeInTheDocument();
      expect(screen.getByText('Test Session 2')).toBeInTheDocument();
    });
  });

  test('handles import error for invalid JSON', async () => {
    renderComponent();
    
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const invalidJson = 'invalid json data';
    
    simulateFileUpload(invalidJson);
    
    const confirmImportButton = screen.getByText('Import');
    fireEvent.click(confirmImportButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Error importing sessions'));
    });
  });

  test('handles import error for non-array data', async () => {
    renderComponent();
    
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const nonArrayJson = { notAnArray: true };
    
    simulateFileUpload(nonArrayJson);
    
    const confirmImportButton = screen.getByText('Import');
    fireEvent.click(confirmImportButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error importing sessions: Invalid import format');
    });
  });

  test('imports sessions with notes successfully', async () => {
    renderComponent();
    
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const validSessionsWithNotes = [
      {
        id: 1725060219774,
        name: "Test Session",
        notes: [
          {
            type: "Note",
            content: "Test note content",
            app: "None",
            os: "None",
            env: "None",
            id: 1725060217087
          }
        ],
        date: "2024-08-30T23:23:39.774Z",
        duration: 0
      }
    ];
    
    simulateFileUpload(validSessionsWithNotes);
    
    const confirmImportButton = screen.getByText('Import');
    fireEvent.click(confirmImportButton);
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('1 sessions imported successfully');
      expect(screen.getByText('Test Session')).toBeInTheDocument();
    });
  });

  test('handles import of multiple sessions with various structures', async () => {
    renderComponent();
    
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const mixedSessions = [
      {
        id: 1,
        name: "Session 1",
        notes: [],
        date: "2024-01-01T00:00:00.000Z",
        duration: 0
      },
      {
        id: 2,
        name: "Session 2",
        notes: [
          {
            type: "Note",
            content: "Note in session 2",
            app: "UCL",
            os: "Android",
            env: "PROD",
            id: 1000
          }
        ],
        date: "2024-01-02T00:00:00.000Z",
        duration: 300
      },
      {
        id: 3,
        name: "Session 3",
        notes: [
          {
            type: "Failed",
            content: "Failed test in session 3",
            app: "None",
            os: "None",
            env: "None",
            id: 2000
          },
          {
            type: "Retest",
            content: "Retest in session 3",
            app: "UEL",
            os: "iOS",
            env: "INT",
            id: 3000
          }
        ],
        date: "2024-01-03T00:00:00.000Z",
        duration: 600
      }
    ];
    
    simulateFileUpload(mixedSessions);
    
    const confirmImportButton = screen.getByText('Import');
    fireEvent.click(confirmImportButton);
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('3 sessions imported successfully');
      expect(screen.getByText('Session 1')).toBeInTheDocument();
      expect(screen.getByText('Session 2')).toBeInTheDocument();
      expect(screen.getByText('Session 3')).toBeInTheDocument();
    });
  });
});
