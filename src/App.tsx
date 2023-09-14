import { useRef, useState, useEffect } from "react";
import useProducts from "./hooks/useProducts";

function App() {
  const [skip, setSkip] = useState<number>(0);
  const [query, setQuery] = useState<string>("");

  const { products, isLoading, hasNextPage, isError, error } = useProducts(
    skip,
    query
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

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
            <div ref={containerRef} key={product.id}>
              <p>id: {product.id}</p>
              <p>title: {product.title}</p>
              <p>price: {product.price}</p>
              <p>thumbnail: {product.thumbnail}</p>
            </div>
          ) : (
            <div key={product.id}>
              <p>id: {product.id}</p>
              <p>title: {product.title}</p>
              <p>price: {product.price}</p>
              <p>thumbnail: {product.thumbnail}</p>
            </div>
          )
        )}
      </div>

      <div>{isLoading && "Loading..."}</div>
    </>
  );
}

export default App;
