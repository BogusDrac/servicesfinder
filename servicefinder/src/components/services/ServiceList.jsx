import React, { useState } from 'react';
import { Star, Phone, Mail, MapPin, Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Service Card Component - Grid View
 */
const ServiceCardGrid = ({ service, onContact, onRate }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={service.image || 'https://via.placeholder.com/400x200'}
          alt={service.name}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold shadow-lg capitalize">
          {service.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{service.name}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(service.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-1 font-semibold text-sm">{service.rating.toFixed(1)}</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{service.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="truncate">{service.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{service.email}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onContact(service)}
            disabled={!isAuthenticated()}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isAuthenticated()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => onRate(service)}
            disabled={!isAuthenticated()}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isAuthenticated()
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Rate
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Service Card Component - List View
 */
const ServiceCardList = ({ service, onContact, onRate }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0">
          <img
            src={service.image || 'https://via.placeholder.com/150x100'}
            alt={service.name}
            className="w-full md:w-32 h-32 object-cover rounded-lg"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{service.name}</h3>
              <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold capitalize">
                {service.category}
              </span>
            </div>

            <div className="flex items-center gap-1 mt-2 md:mt-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(service.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 font-semibold text-sm">{service.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{service.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="truncate">{service.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="truncate">{service.email}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onContact(service)}
              disabled={!isAuthenticated()}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isAuthenticated()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => onRate(service)}
              disabled={!isAuthenticated()}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isAuthenticated()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Rate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main ServiceList Component
 */
const ServiceList = ({ services, onContact, onRate, loading = false }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Sort services based on sortBy
  const sortedServices = [...services].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'oldest':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
            }`}
            title="Grid View"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
            }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rated</option>
            <option value="rating-low">Lowest Rated</option>
            <option value="name">Name A-Z</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters Panel (collapsible) */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">Additional filters coming soon...</p>
        </div>
      )}

      {/* Services Grid/List */}
      {sortedServices.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {sortedServices.map((service) => (
            viewMode === 'grid' ? (
              <ServiceCardGrid
                key={service.id}
                service={service}
                onContact={onContact}
                onRate={onRate}
              />
            ) : (
              <ServiceCardList
                key={service.id}
                service={service}
                onContact={onContact}
                onRate={onRate}
              />
            )
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
