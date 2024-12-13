const Pagination = ({ page, setPage, totalPages }) => {
  console.log("page", page);
  console.log("totalPages", totalPages);
  // console.log("setpage", setPage);
  const handlePrevious = () => {
    setPage(page === 1 ? totalPages : page - 1);
  };

  const handleNext = () => {
    setPage(page === totalPages ? 1 : page + 1);
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        className="px-3 py-1 bg-purple-700 text-white rounded-md hover:bg-purple-800"
        onClick={handlePrevious}
        disabled={totalPages <= 1}
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`px-3 py-1 rounded-md ${
            page === index + 1
              ? 'bg-purple-700 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handlePageClick(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 bg-purple-700 text-white rounded-md hover:bg-purple-800"
        onClick={handleNext}
        disabled={totalPages <= 1}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
