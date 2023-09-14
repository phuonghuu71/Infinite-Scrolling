import { useRef, useState, useEffect } from "react";
import useProducts from "./hooks/useProducts";
import Product from "./components/Product";

function App() {
  const [skip, setSkip] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { products, isLoading, hasNextPage, isError, error } = useProducts(
    skip,
    query
  );

  useEffect(() => {
    const currentContainerRef = containerRef.current;

    if (isLoading) return;

    const intObserver = new IntersectionObserver((products) => {
      if (products[0].isIntersecting && hasNextPage) {
        setSkip((prev) => prev + 20);
      }
    });

    if (currentContainerRef) intObserver.observe(currentContainerRef);

    return () => {
      if (currentContainerRef) intObserver.unobserve(currentContainerRef);
    };
  }, [isLoading, hasNextPage]);

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
    setSkip(0);
  };

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <input type="text" value={query} onChange={handleSearch} />

      <div>
        {products.map((product, i) =>
          products.length === i + 1 ? (
            <Product key={product.id} {...product} ref={containerRef} />
          ) : (
            <Product key={product.id} {...product} />
          )
        )}
      </div>

      <div>{isLoading && "Loading..."}</div>
    </>
  );
}

export default App;
