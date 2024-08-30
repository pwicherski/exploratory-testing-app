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

  test('imports sessions successfully', async () => {
    renderComponent();
    
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const confirmImportButton = screen.getByText('Import');
    
    const validSessionsJson = JSON.stringify([
      { id: 1, name: 'Test Session 1', date: '2023-01-01T00:00:00.000Z', notes: [] },
      { id: 2, name: 'Test Session 2', date: '2023-01-02T00:00:00.000Z', notes: [] }
    ]);
    
    const file = new File([validSessionsJson], 'sessions.json', { type: 'application/json' });
    const fileInput = screen.getByLabelText('Import');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
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
    
    const confirmImportButton = screen.getByText('Import');
    
    const invalidJson = 'invalid json data';
    
    const file = new File([invalidJson], 'invalid.json', { type: 'application/json' });
    const fileInput = screen.getByLabelText('Import');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    fireEvent.click(confirmImportButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Error importing sessions'));
    });
  });

  test('handles import error for non-array data', async () => {
    renderComponent();
    
    const importButton = screen.getByText('Import Sessions');
    fireEvent.click(importButton);
    
    const confirmImportButton = screen.getByText('Import');
    
    const nonArrayJson = JSON.stringify({ notAnArray: true });
    
    const file = new File([nonArrayJson], 'non-array.json', { type: 'application/json' });
    const fileInput = screen.getByLabelText('Import');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    fireEvent.click(confirmImportButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error importing sessions: Invalid import format');
    });
  });

  // Add more tests as needed
});