const SizeBar = ({ setLimit }) => {
  return (
    <div className="flex items-center mb-4">
      <label className="text-gray-700 mr-2">Items per page:</label>
      <select
        onChange={(e) => setLimit(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
      >
        {[5, 10, 15].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SizeBar;
