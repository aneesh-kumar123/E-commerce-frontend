"use client";

import { useState } from "react";

const BuyNowModal = ({ isOpen, onClose, product, onContinue }) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleContinue = () => {
    onContinue(product, quantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-extrabold mb-4 text-white text-center">Buy Now</h2>
        <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-md shadow">
          <img
            src={product.image || "/default-image.jpg"}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{product.name}</h3>
            <p className="text-sm text-gray-400">Price: ${product.price}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">Quantity:</p>
          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={handleDecrease}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 focus:ring-2 focus:ring-red-300"
            >
              -
            </button>
            <p className="font-bold text-white">{quantity}</p>
            <button
              onClick={handleIncrease}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 focus:ring-2 focus:ring-green-300"
            >
              +
            </button>
          </div>
          <p className="mt-4 font-bold text-white">
            Total Price: ${(product.price * quantity).toFixed(2)}
          </p>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
