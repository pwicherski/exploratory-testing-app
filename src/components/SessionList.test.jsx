import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SessionList from './SessionList';
import { toast } from 'sonner';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

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
    const fileInput = screen.getByLabelText('Session File');
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);
  };

  test('opens import dialog when Import Sessions button is clicked', () => {
    renderComponent();
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    expect(screen.getByText('Select a JSON file to import sessions.')).toBeInTheDocument();
  });

  test('displays number of sessions found in import file', async () => {
    renderComponent();
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const validSessions = [
      { id: 1, name: 'Test Session 1', date: '2023-01-01T00:00:00.000Z', notes: [] },
      { id: 2, name: 'Test Session 2', date: '2023-01-02T00:00:00.000Z', notes: [] }
    ];
    
    simulateFileUpload(validSessions);
    
    await waitFor(() => {
      expect(screen.getByText('2 sessions found in the file')).toBeInTheDocument();
    });
  });

  test('imports sessions successfully', async () => {
    renderComponent();
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const validSessions = [
      { id: 1, name: 'Test Session 1', date: '2023-01-01T00:00:00.000Z', notes: [] },
      { id: 2, name: 'Test Session 2', date: '2023-01-02T00:00:00.000Z', notes: [] }
    ];
    
    simulateFileUpload(validSessions);
    
    await waitFor(() => {
      const confirmImportButton = screen.getByText('Import 2 Sessions');
      fireEvent.click(confirmImportButton);
    });
    
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
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Error reading import file'));
    });
  });

  test('handles import error for non-array data', async () => {
    renderComponent();
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const nonArrayJson = { notAnArray: true };
    
    simulateFileUpload(nonArrayJson);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Error reading import file'));
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
    
    await waitFor(() => {
      const confirmImportButton = screen.getByText('Import 1 Sessions');
      fireEvent.click(confirmImportButton);
    });
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('1 sessions imported successfully');
      expect(screen.getByText('Test Session')).toBeInTheDocument();
    });
  });

  test('closes import dialog when cancel button is clicked', async () => {
    renderComponent();
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Select a JSON file to import sessions.')).not.toBeInTheDocument();
    });
  });

  test('disables import button when no valid sessions are found', async () => {
    renderComponent();
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const emptyArray = [];
    
    simulateFileUpload(emptyArray);
    
    await waitFor(() => {
      const confirmImportButton = screen.getByText('Import 0 Sessions');
      expect(confirmImportButton).toBeDisabled();
    });
  });
});