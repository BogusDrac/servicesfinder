const Logo = () => {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* Creative Map Pin + Search Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className="w-8 h-8"
      >
        <circle cx="28" cy="28" r="12" fill="#FFA724" />
        <circle cx="28" cy="28" r="18" fill="#ffffff" />
        <path
          d="M28 4C15.3 4 5 14.3 5 27s10.3 23 23 23 23-10.3 23-23S40.7 4 28 4zm0 40c-9.4 0-17-7.6-17-17s7.6-17 17-17 17 7.6 17 17-7.6 17-17 17z"
          fill="#0D6EFD"
        />
        <rect
          x="40"
          y="40"
          width="18"
          height="8"
          rx="4"
          transform="rotate(45 40 40)"
          fill="#0D6EFD"
        />
      </svg>

      {/* Logo Text */}
      <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">
        Service<span className="text-orange-500">Finder</span>
      </h1>
    </div>
  );
};

export default Logo;
