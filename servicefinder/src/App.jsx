import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import AuthProvider, { useAuth } from './components/Auth/AuthProvider';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ServiceCard from './components/services/ServiceCard';
import ServiceList from './components/services/ServiceList';
import AddServiceModal from './components/services/AddServiceModal';
import AuthModal from './components/Auth/AuthModal';
import RateServiceModal from './components/services/RateServiceModal';
import { serviceService } from './firebase/firebaseServices';
import SearchBar from './components/common/SearchBar';



// Main App
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesData = await serviceService.getAllServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleContact = (service) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    alert(`Contacting ${service.name}\n\nPhone: ${service.phone}\nEmail: ${service.email}\n\nYou can now reach out to them directly!`);
  };

  const handleRate = (service) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedService(service);
    setRateModalOpen(true);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      service.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onAuthClick={() => setAuthModalOpen(true)}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onAddService={() => {
            if (!currentUser) {
              setAuthModalOpen(true);
            } else {
              setAddServiceOpen(true);
            }
          }}
          onFilterChange={setSelectedCategory}
          currentUser={currentUser}
          selectedCategory={selectedCategory}
        />

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Find Local Services</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services, categories, or cities..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {!currentUser && (
              <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <p className="text-yellow-800 text-sm sm:text-base">
                  <strong>Note:</strong> Sign in to contact service providers, rate services, and post your own services.
                </p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-gray-600 text-sm">
                Showing <strong>{filteredServices.length}</strong> service{filteredServices.length !== 1 ? 's' : ''} 
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(service => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onContact={handleContact}
                      onRate={handleRate}
                      currentUser={currentUser}
                    />
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <Search className="w-16 h-16 text-gray-300 mx-auto" />
                    </div>
                    <p className="text-gray-500 text-lg mb-2">No services found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <AddServiceModal 
        isOpen={addServiceOpen} 
        onClose={() => setAddServiceOpen(false)}
        onServiceAdded={fetchServices}
      />
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
      />

      <RateServiceModal
        isOpen={rateModalOpen}
        onClose={() => {
          setRateModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        onRated={fetchServices}
      />
    </div>
  );
};

export default App;
              