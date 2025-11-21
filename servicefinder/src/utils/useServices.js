import { useState, useEffect, useCallback } from 'react';
import { serviceService } from '../firebase/firebaseServices';

/**
 * Custom hook for managing services data
 * Fetches all services and provides refetch capability
 * @returns {object} Services data and methods
 */
export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all services from Firestore
   */
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices
  };
};

/**
 * Custom hook for managing services with advanced filtering
 * Provides search, category, city, and rating filters
 * @returns {object} Services data, filters, and methods
 */
export const useServicesWithFilters = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, rating-high, rating-low, name

  /**
   * Fetch all services from Firestore
   */
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceService.getAllServices();
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Apply filters and sorting to services
   */
  const applyFilters = useCallback(() => {
    let filtered = services;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.category.toLowerCase().includes(searchLower) ||
        service.city.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Apply city filter
    if (selectedCity !== 'All') {
      filtered = filtered.filter(service => service.city === selectedCity);
    }

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter(service => service.rating >= minRating);
    }

    // Apply sorting
    filtered.sort((a, b) => {
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

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory, selectedCity, minRating, sortBy]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    services,
    filteredServices,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    refetch: fetchServices
  };
};

/**
 * Custom hook for service search with debouncing
 * @param {Array} services - Array of services to search through
 * @returns {object} Search state and methods
 */
export const useServiceSearch = (services = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Perform search when debounced term changes
  useEffect(() => {
    const search = async () => {
      if (!debouncedTerm.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const searchLower = debouncedTerm.toLowerCase();

        const filtered = services.filter(service =>
          service.name.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower) ||
          service.category.toLowerCase().includes(searchLower) ||
          service.city.toLowerCase().includes(searchLower)
        );

        setResults(filtered);
      } catch (err) {
        console.error('Error searching services:', err);
        setError(err.message || 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedTerm, services]);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedTerm('');
    setResults([]);
    setError(null);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    clearSearch
  };
};

/**
 * Custom hook for service pagination
 * @param {Array} services - Array of services to paginate
 * @param {number} itemsPerPage - Number of items per page (default: 9)
 * @returns {object} Pagination data and methods
 */
export const useServicePagination = (services = [], itemsPerPage = 9) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = services.slice(startIndex, endIndex);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  /**
   * Go to previous page
   */
  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  /**
   * Go to specific page
   * @param {number} page - Page number
   */
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  /**
   * Reset to first page
   */
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Reset to first page when services change
  useEffect(() => {
    setCurrentPage(1);
  }, [services.length]);

  return {
    currentPage,
    totalPages,
    currentServices,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    nextPage,
    previousPage,
    goToPage,
    reset
  };
};

export default useServices;
