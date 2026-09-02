import { useEffect, useState } from "react";
import { dataProvider, type DataProvider } from "../connection";

/**
 * Every list/dashboard page calls this instead of importing mock data
 * directly. `fetcher` receives the currently active provider (demo,
 * Supabase, MySQL, or MongoDB — whichever VITE_BACKEND resolves to) and
 * returns whatever that page needs. Re-runs if `deps` changes.
 */
export function useProviderQuery<T>(
  fetcher: (provider: DataProvider) => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    fetcher(dataProvider)
      .then((result) => {
        if (active) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load data.");
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error };
}
