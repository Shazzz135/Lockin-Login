import { useState, useEffect } from 'react';

export default function useFetch(url: string) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData);
  }, [url]);
  return data;
}
