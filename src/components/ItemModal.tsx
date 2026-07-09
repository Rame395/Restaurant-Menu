"use client";

import { useEffect, useState } from 'react';
import { MenuItem } from './types';

interface ItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function ItemModal({ item, onClose }: ItemModalProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Smooth entrance animation
  useEffect(() => {
    setIsRendered(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsRendered(false);
    setTimeout(onClose, 300); // match transition duration
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isRendered ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`relative w-full sm:w-[500px] max-h-[90vh] bg-[#1a1006] sm:rounded-3xl rounded-t-3xl sm:rounded-t-3xl overflow-hidden shadow-2xl flex flex-col transition-transform duration-300 transform ${isRendered ? 'translate-y-0' : 'translate-y-full sm:translate-y-8 sm:opacity-0'}`}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Large Image */}
        <div className="w-full h-[250px] sm:h-[300px] relative bg-neutral-900 flex-shrink-0">
          {item.image_url && !imageError ? (
            <img 
              src={item.image_url} 
              alt={item.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
          )}
          {/* Subtle gradient overlay for text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1006] via-transparent to-transparent opacity-80"></div>
        </div>

        {/* Details Area */}
        <div className="p-6 sm:p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {item.name}
            </h2>
            <span className="text-xl sm:text-2xl font-bold text-[#fde047] flex-shrink-0 mt-1">
              Rs. {item.price.toFixed(2)}
            </span>
          </div>

          {/* Tags & Sizes */}
          <div className="flex flex-wrap gap-2 mb-6">
            {item.size && (
              <span className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold bg-[#c21820] text-white">
                {item.size}
              </span>
            )}
            {item.tags?.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                {tag.toLowerCase() === 'veg' ? <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> : null}
                {tag.toLowerCase() === 'non-veg' ? <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span> : null}
                {tag}
              </span>
            ))}
          </div>

          <div className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8">
            {item.description ? item.description : "No description available for this item."}
          </div>

          {/* Call to action (optional for future ordering system) */}
          <button 
            onClick={handleClose}
            className="w-full mt-auto py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-colors border border-neutral-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
