import React from "react";
import "./App.css";

const ProductCard = ({ name, price, inStock }) => {
  return (
    <div className="product-card">
      <h3 className="product-title">{name}</h3>
      <p className="product-price">Price: ${price}</p>
      <p>Status: {inStock ? "In Stock" : "Out of Stock"}</p>
    </div>
  );
};

export default ProductCard;
