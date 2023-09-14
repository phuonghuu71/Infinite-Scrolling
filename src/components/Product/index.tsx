import { forwardRef, memo } from "react";
import { ProductProps } from "../../hooks/useProducts";

const Product = memo(
  forwardRef<HTMLDivElement | null, ProductProps>((product, ref) => (
    <div ref={ref}>
      <p>id: {product.id}</p>
      <p>title: {product.title}</p>
      <p>price: {product.price}</p>
      <p>thumbnail: {product.thumbnail}</p>
    </div>
  ))
);

export default Product;
