import { MapPin, Star, Phone, Mail, Heart, ExternalLink, Award, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

const ServiceCard = ({ service, onContact, onRate, currentUser }) => {

  const [isFavorite, setIsFavorite] = useState(false);

  // claculate average rating reviews
  const reviews = service.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  const isTopRated = averageRating >= 4.5;


  // Color schemes for different categories
  const colorSchemes = {
    plumbing: {
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      badge: 'from-blue-600 to-cyan-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-50',
      border: 'border-blue-200'
    },
    electrical: {
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      badge: 'from-amber-600 to-orange-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      hoverBg: 'hover:bg-amber-50',
      border: 'border-amber-200'
    },
    carpentry: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      badge: 'from-emerald-600 to-teal-700',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      hoverBg: 'hover:bg-emerald-50',
      border: 'border-emerald-200'
    },
    painting: {
      gradient: 'from-purple-500 to-pink-600',
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      badge: 'from-purple-600 to-pink-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      hoverBg: 'hover:bg-purple-50',
      border: 'border-purple-200'
    },
    cleaning: {
      gradient: 'from-indigo-500 to-blue-600',
      bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
      badge: 'from-indigo-600 to-blue-700',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      hoverBg: 'hover:bg-indigo-50',
      border: 'border-indigo-200'
    },
    gardening: {
      gradient: 'from-green-500 to-lime-600',
      bg: 'bg-gradient-to-br from-green-50 to-lime-50',
      badge: 'from-green-600 to-lime-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      hoverBg: 'hover:bg-green-50',
      border: 'border-green-200'
    },
    default: {
      gradient: 'from-gray-500 to-slate-600',
      bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
      badge: 'from-gray-600 to-slate-700',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      hoverBg: 'hover:bg-gray-50',
      border: 'border-gray-200'
    }
  };

  const colors = colorSchemes[service.category.toLowerCase()] || colorSchemes.default;

  return (
    <div className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 ${colors.border}`}>
      {/* HEADER SECTION with gradient */}
      <div className={`relative h-32 bg-gradient-to-br ${colors.gradient} overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
        
        <div className="relative h-full flex items-center justify-between p-5">
          {/* Category Badge */}
          <span className={`px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-xs font-bold shadow-lg capitalize`}>
            {service.category}
          </span>

          {/* Top Rated Badge */}
          {isTopRated && (
            <div className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-gray-800">Top Rated</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 active:scale-95 ml-auto"
            aria-label="Add to favorites"
          >
            <Heart 
              className={`w-5 h-5 transition-colors duration-200 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`} 
            />
          </button>
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className={`p-5 ${colors.bg}`}>
        {/* Title & Description */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:${colors.iconColor} transition-colors duration-200`}>
            {service.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>

        {/* Rating Section with Reviews */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 transition-all duration-200 ${
                    i < Math.floor(averageRating) 
                      ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
              <span className="ml-1 font-bold text-lg text-gray-900">
                {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Users className="w-4 h-4" />
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          {/* Recent Reviews Preview */}
          {reviews.length > 0 && (
            <div className="mt-3 space-y-2">
              {reviews.slice(0, 2).map((review, idx) => (
                <div key={idx} className="bg-white/60 rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < review.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-700">{review.userName}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{review.comment}</p>
                </div>
              ))}
              {reviews.length > 2 && (
                <p className="text-xs text-gray-500 text-center">
                  +{reviews.length - 2} more reviews
                </p>
              )}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2.5 mb-5">
          <div className={`flex items-center gap-3 text-sm text-gray-700 ${colors.hoverBg} transition-colors duration-200 group/item rounded-lg p-2`}>
            <div className={`p-1.5 ${colors.iconBg} rounded-lg group-hover/item:scale-110 transition-transform duration-200`}>
              <MapPin className={`w-4 h-4 ${colors.iconColor}`} />
            </div>
            <span className="truncate font-medium">{service.city}</span>
          </div>
          
          <div className={`flex items-center gap-3 text-sm text-gray-700 ${colors.hoverBg} transition-colors duration-200 group/item rounded-lg p-2`}>
            <div className={`p-1.5 ${colors.iconBg} rounded-lg group-hover/item:scale-110 transition-transform duration-200`}>
              <Phone className={`w-4 h-4 ${colors.iconColor}`} />
            </div>
            <span className="truncate font-medium">{service.phone}</span>
          </div>
          
          <div className={`flex items-center gap-3 text-sm text-gray-700 ${colors.hoverBg} transition-colors duration-200 group/item rounded-lg p-2`}>
            <div className={`p-1.5 ${colors.iconBg} rounded-lg group-hover/item:scale-110 transition-transform duration-200`}>
              <Mail className={`w-4 h-4 ${colors.iconColor}`} />
            </div>
            <span className="truncate font-medium">{service.email}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={() => onContact(service)}
            disabled={!currentUser}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              currentUser
                ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg hover:shadow-xl active:scale-95 hover:scale-105`
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentUser ? (
              <>
                Contact Now
                <ExternalLink className="w-4 h-4" />
              </>
            ) : (
              'Sign In to Contact'
            )}
          </button>
          
          {currentUser && (
            <button
              onClick={() => onRate(service)}
              className={`px-4 py-3 border-2 ${colors.border} ${colors.iconColor} rounded-xl ${colors.hoverBg} font-bold transition-all duration-200 hover:scale-105 active:scale-95 group/rate`}
              aria-label="Rate service"
            >
              <Star className="w-5 h-5 group-hover/rate:fill-current transition-all duration-200" />
            </button>
          )}
        </div>

        {/* Quick Stats */}
        {currentUser && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              <span>95% Response Rate</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;