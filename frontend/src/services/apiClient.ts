export async function apiClient(endpoint: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(endpoint, options);
  return res.json();
}
