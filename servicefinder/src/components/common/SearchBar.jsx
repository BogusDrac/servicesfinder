import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // send search text to parent
  };

  return (
    <div className="w-full flex items-center bg-white rounded-xl shadow-sm border px-4 py-2">
      <Search className="text-gray-500 w-5 h-5" />
      <input
        type="text"
        placeholder="Search for services..."
        value={query}
        onChange={handleChange}
        className="flex-1 ml-3 outline-none bg-transparent text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
