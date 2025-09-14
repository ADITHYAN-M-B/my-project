import React from 'react';
import './App.css';

const ProductCard = ({ name, price, inStock }) => {
  return (
    <div className="product-card">
      <div className="product-content">
        <h3 className="product-title">{name}</h3>
        <p className="product-price">
          Price: ${price.toFixed(2)}
        </p>
      </div>
      <div className="product-status">
        <p className="status-text">
          Status:
          <span className={`status-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProductCard;