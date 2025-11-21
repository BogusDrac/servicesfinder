import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useAuth } from "../Auth/AuthProvider";
import { serviceService, storageService } from "../../firebase/firebaseServices";
import { validateServiceForm } from "../../utils/validators";
import LoadingSpinner from "../common/LoadingSpinner";

const AddServiceModal = ({ isOpen, onClose, onServiceAdded }) => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    phone: '',
    email: currentUser?.email || '',
    city: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const validation = validateServiceForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setUploading(true);
    try {
      let imageUrl = '';
      
      // Upload image if exists
      if (imageFile) {
        imageUrl = await storageService.uploadImage(imageFile, 'services');
      }

      // Add service to Firestore
      await serviceService.addService(
        {
          ...formData,
          image: imageUrl
        },
        currentUser.uid
      );

      alert('Service added successfully!');
      if (onServiceAdded) onServiceAdded();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        phone: '',
        email: currentUser?.email || '',
        city: ''
      });
      setImageFile(null);
      setImagePreview(null);
      setErrors({});
    } catch (error) {
      alert('Error adding service: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Add Your Service</h2>
            <button onClick={onClose} disabled={uploading}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">Service Image</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-600 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload image</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Service Name *</label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                  errors.name ? 'border-red-500' : ''
                }`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John's Plumbing Services"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                  errors.category ? 'border-red-500' : ''
                }`}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select category</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="carpentry">Carpentry</option>
                <option value="painting">Painting</option>
                <option value="cleaning">Cleaning</option>
                <option value="gardening">Gardening</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                  errors.description ? 'border-red-500' : ''
                }`}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your services..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081 234 5678"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">City *</label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                  errors.city ? 'border-red-500' : ''
                }`}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Johannesburg"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                disabled={uploading}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...<LoadingSpinner />
                  </>
                ) : (
                  'Add Service'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;