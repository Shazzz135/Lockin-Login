import { useState } from 'react';

export default function useAuth() {
  const [user, setUser] = useState<any>(null);
  // Add logic for authentication state
  return { user, setUser };
}
