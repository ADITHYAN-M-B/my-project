import React from 'react';
import ProductCard from './ProductCard';
import './App.css';

const products = [
  { name: 'Wireless Mouse', price: 25.99, inStock: true },
  { name: 'Keyboard', price: 45.5, inStock: false },
  { name: 'Monitor', price: 199.99, inStock: true },
];

const App = () => {
  return (
    <main className="app-main">
      <div className="app-container">
        <div className="app-card">
          <h1 className="app-title">
            Products List
          </h1>
          <div className="product-list">
            {products.map((product) => (
              <ProductCard
                key={product.name}
                name={product.name}
                price={product.price}
                inStock={product.inStock}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;