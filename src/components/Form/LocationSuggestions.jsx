import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

export const LocationSuggestions = ({
  suggestions,
  onSelectSuggestion,
  inputRef
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const suggestionsContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsContainerRef.current &&
        !suggestionsContainerRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef]);

  useEffect(() => {
    setIsVisible(suggestions.length > 0);
  }, [suggestions]);

  return (
    <div className="relative">
      <AnimatePresence>
        {isVisible && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsContainerRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative mt-1 z-50"
          >
            <div className="bg-white border border-yellow-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="px-4 py-3 cursor-pointer hover:bg-yellow-50 transition-colors group border-b last:border-b-0 border-yellow-100 flex items-center justify-between"
                  onClick={() => {
                    onSelectSuggestion(suggestion);
                    setIsVisible(false);
                  }}
                >
                  <div>
                    <p className="text-sm font-medium text-yellow-800 group-hover:text-yellow-900">
                      {suggestion.PlaceName}
                    </p>
                    <p className="text-xs text-yellow-500 group-hover:text-yellow-600">
                      {suggestion.Type}
                    </p>
                  </div>
                  <MapPin className="w-5 h-5 text-yellow-400 group-hover:text-yellow-600 transition-colors" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export const ApplicationIDModal = ({
  applicationId,
  onClose
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(applicationId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 bg-yellow-50 rounded-full p-4 inline-block"
          >
            <CheckCircle2 className="w-12 h-12 text-yellow-600" />
          </motion.div>

          <h2 className="text-2xl font-bold text-yellow-900 mb-4">
            Application Submitted Successfully!
          </h2>

          <p className="text-gray-600 mb-6">
            Please save your Application ID for future reference.
          </p>

          <motion.div
            className="bg-yellow-100 rounded-lg p-4 flex items-center justify-between mb-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-yellow-900 font-semibold tracking-wider">
              {applicationId}
            </span>
            <motion.button
              onClick={copyToClipboard}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              {isCopied ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-green-600 flex items-center"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Copied!
                </motion.div>
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </motion.button>
          </motion.div>

          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-600 text-white py-3 rounded-lg font-medium hover:from-yellow-700 hover:to-yellow-700 transition-all"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};