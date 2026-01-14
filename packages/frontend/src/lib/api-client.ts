const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export async function api(endpoint: string, options: RequestInit = {}) {
  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error);
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}
