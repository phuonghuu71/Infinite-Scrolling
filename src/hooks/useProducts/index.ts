import { useEffect, useState } from "react";
import { apiHandler } from "../../api/axios";

export interface ProductProps {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

interface ErrorProps {
  message?: string;
}

export default (skip: number, query: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [error, setError] = useState<ErrorProps>({});
  const [products, setProducts] = useState<ProductProps[]>([]);

  // only trigger when query changes
  useEffect(() => {
    setProducts([]);
  }, [query]);

  useEffect(() => {
    // reset settings
    setIsLoading(true);
    setIsError(false);
    setError({});

    // Cancel API requests
    const controller = new AbortController();
    const { signal } = controller;

    apiHandler({
      params: { skip: skip, q: query, limit: 20 },
      signal,
    })
      .then((response) => {
        setProducts((prev) => [
          ...prev,
          ...response.products.map((product: ProductProps) => product),
        ]);

        setHasNextPage(skip + 20 < response.total);
      })
      .catch((error) => {
        if (signal.aborted) return;

        setIsError(true);
        setError({
          message: error.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [skip, query]);

  return {
    products,
    isLoading,
    hasNextPage,
    isError,
    error,
  };
};
