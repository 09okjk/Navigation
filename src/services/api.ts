// API service for communicating with the backend

interface Tool {
  id: string;
  name: string;
  description?: string;
  maintainer: string;
  version: string;
  url: string;
}

// API base URL - change this to your production server URL when deploying
const API_URL = 'http://localhost:3000/api';

// Get all tools from the server
export const getTools = async (): Promise<Tool[]> => {
  try {
    const response = await fetch(`${API_URL}/tools`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tools:', error);
    // If server is not available, try to get from localStorage as fallback
    const savedTools = localStorage.getItem('tools');
    return savedTools ? JSON.parse(savedTools) : [];
  }
};

// Add a new tool
export const addTool = async (tool: Omit<Tool, 'id'>): Promise<Tool> => {
  try {
    const response = await fetch(`${API_URL}/tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tool),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding tool:', error);
    throw error;
  }
};

// Update an existing tool
export const updateTool = async (tool: Tool): Promise<Tool> => {
  try {
    const response = await fetch(`${API_URL}/tools/${tool.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tool),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating tool:', error);
    throw error;
  }
};

// Delete a tool
export const deleteTool = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/tools/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
};
