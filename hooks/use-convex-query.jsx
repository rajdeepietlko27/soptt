import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
  // Detect Convex's "skip" sentinel — the last arg tells Convex not to run the query.
  const isSkipped = args[args.length - 1] === "skip";

  const result = useQuery(query, ...args);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(!isSkipped);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If the query is intentionally skipped, treat it as "not loading, no data"
    // and never start the error timeout.
    if (isSkipped) {
      setIsLoading(false);
      setData(undefined);
      setError(null);
      return;
    }

    if (result === undefined) {
      setIsLoading(true);

      // Add timeout - if still loading after 10s, show error
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setError(new Error("Request timed out. Check your connection."));
        toast.error("Failed to load data. Please refresh the page.");
      }, 10000);

      return () => clearTimeout(timeout);
    } else {
      try {
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [result, isSkipped]);

  return { data, isLoading, error };
};

export const useConvexMutation = (mutation) => {
  const mutationFn = useMutation(mutation);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
};