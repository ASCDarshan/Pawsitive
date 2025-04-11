// src/components/Home/ResourceFinderSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResourceFinderSection = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-6 -mb-16 relative z-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center border border-lavender-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lavender-100 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/2"></div>
        
        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8 relative z-10">
          <h2 className="text-2xl font-bold text-lavender-900 mb-3">Need help finding the right resources?</h2>
          <p className="text-gray-600 mb-6">
            Not sure what your pet needs? Our resource finder can help you discover the perfect services and products for your furry friend.
          </p>
          <button 
            onClick={() => navigate("/resource-finder")}
            className="bg-gradient-to-r from-lavender-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:from-lavender-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            <FaSearch className="mr-2" />
            Try Resource Finder
          </button>
        </div>
        <div className="md:w-1/3 flex justify-center relative z-10">
          <div className="text-7xl bg-gradient-to-br from-lavender-200 to-lavender-100 p-5 rounded-full shadow-inner">🔍</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceFinderSection;