import { Plus, X, Wrench, Paintbrush, Leaf, Hammer, Zap, Sparkles, Settings } from "lucide-react";
import Logo from "../common/Logo";

const Sidebar = ({
  isOpen,
  onClose,
  onAddService,
  currentUser,
  selectedCategory,
  onFilterChange
}) => {
  const categories = [
    { label: "All", icon: Sparkles },
    { label: "Plumbing", icon: Wrench },
    { label: "Electrical", icon: Zap },
    { label: "Carpentry", icon: Hammer },
    { label: "Painting", icon: Paintbrush },
    { label: "Cleaning", icon: Sparkles },
    { label: "Gardening", icon: Leaf },
  ];

  return (
    <>
      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg 
          z-50 overflow-y-auto border-r transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 flex flex-col h-full">

          {/* LOGO + CLOSE BUTTON (mobile) */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <Logo className="w-4 h-4"/>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-200/60 transition-all active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-600" /> 
            </button>
          </div>

          {/* ADD SERVICE BUTTON */}
          {currentUser && (
            <button
              onClick={() => {
                onAddService();
                onClose();
              }}
              className="
                w-full mb-8 px-5 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-3
                bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold 
                hover:from-blue-700 hover:to-blue-800 active:scale-[0.97]
                transition-all duration-200 group
              "
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Service
            </button>
          )}

          {/* CATEGORY SECTION */}
          <div className="flex-1">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider px-1">
              Categories
            </h3>

            <nav className="space-y-1.5">
              {categories.map(({ label, icon: Icon }) => {
                const active = selectedCategory === label;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      onFilterChange(label);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      font-medium group relative overflow-hidden
                      ${active
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-[1.02]"
                        : "hover:bg-blue-50 hover:text-blue-700 text-gray-700 hover:scale-[1.01]"}
                    `}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
                    <span className="text-sm">{label}</span>
                    {active && (
                      <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* FOOTER SECTION */}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 group">
              <Settings className="w-5 h-5 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold text-sm text-gray-700">Settings</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
