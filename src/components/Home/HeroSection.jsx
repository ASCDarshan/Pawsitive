import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaDog, FaCat } from "react-icons/fa";
import { motion } from "framer-motion";


const HeaderSection = () => {
  const navigate = useNavigate();
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);

  const handleSearchClick = () => {
    setShowCategoryOptions(true);
  };

  const handleCategorySelect = (category) => {
    if (category === "dog") {
      navigate("/dog-resources");
    } else if (category === "cat") {
      navigate("/cat-resources");
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-lavender-700 to-purple-800 text-white py-16 md:py-24 rounded-b-[40px] shadow-lg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-lavender-500 rounded-full opacity-20"></div>
        <div className="absolute left-1/2 bottom-0 w-96 h-96 bg-purple-600 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Pawsitive <span className="text-lavender-200">Resources</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-lavender-100 max-w-2xl">
            Connecting pet parents with the resources they need for happy, healthy furry companions.
          </p>

          {/* Buttons Section */}
          {!showCategoryOptions ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSearchClick}
                className="bg-white text-lavender-800 hover:bg-lavender-50 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center"
              >
                <FaSearch className="mr-2" /> Search Resources
              </button>
              <button
                onClick={() => navigate("/nearby-mates")}
                className="bg-transparent hover:bg-lavender-600 border-2 border-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center mt-3 sm:mt-0"
              >
                <FaHeart className="mr-2" /> Find Nearby Mates
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleCategorySelect("dog")}
                className="bg-white text-lavender-800 hover:bg-lavender-50 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center"
              >
                <FaDog className="mr-2" /> Dog Resources
              </button>
              <button
                onClick={() => handleCategorySelect("cat")}
                className="bg-white text-lavender-800 hover:bg-lavender-50 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center"
              >
                <FaCat className="mr-2" /> Cat Resources
              </button>
              <button
                onClick={() => setShowCategoryOptions(false)}
                className="bg-transparent hover:bg-lavender-600 border-2 border-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center mt-3 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HeaderSection;
