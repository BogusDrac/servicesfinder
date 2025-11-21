
import { capitalizeFirst } from "../../utils/helpers";

const CategoryFilter = ({ categories = [], activeCategory, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("all")}
        className={`px-4 py-2 rounded-full text-sm font-medium border transition
          ${activeCategory === "all"
            ? "bg-primary-600 text-white"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"}`}
      >
        All
      </button>

      {categories.map((cat, index) => (
        <button
          key={index}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition
            ${activeCategory === cat
              ? "bg-primary-600 text-white"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"}`}
        >
          {capitalizeFirst(cat)}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
