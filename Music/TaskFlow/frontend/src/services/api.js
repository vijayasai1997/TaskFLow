const API_URL = 'http://localhost:5000/api';

function getUser() {
  return localStorage.getItem('userId');
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const userId = getUser();
  if (userId) {
    headers['X-User-ID'] = userId;
  }
  return headers;
}

export const authAPI = {
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.success) localStorage.setItem('userId', json.user.id);
    return json;
  },

  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.success) localStorage.setItem('userId', json.user.id);
    return json;
  },

  logout: () => {
    localStorage.clear();
  }
};

export const projectAPI = {
  getAll: async () => {
    try {
      console.log('Fetching projects from:', `${API_URL}/projects`);
      const res = await fetch(`${API_URL}/projects`, {
        headers: getHeaders()
      });
      const json = await res.json();
      console.log('Projects API response:', json);
      return json;
    } catch (err) {
      console.error('Error in getAll:', err);
      throw err;
    }
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ...data, userId: getUser() })
    });
    return await res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ userId: getUser() })
    });
    return await res.json();
  }
};

export const taskAPI = {
  getAll: async (filters = {}) => {
    let url = `${API_URL}/tasks?`;
    if (filters.projectId) url += `projectId=${filters.projectId}&`;
    if (filters.status) url += `status=${filters.status}`;
    const res = await fetch(url, {
      headers: getHeaders()
    });
    return await res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ...data, userId: getUser() })
    });
    return await res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ userId: getUser() })
    });
    return await res.json();
  }
};

export const dashboardAPI = {
  getStats: async () => {
    const res = await fetch(`${API_URL}/dashboard/stats`, {
      headers: getHeaders()
    });
    return await res.json();
  }
};