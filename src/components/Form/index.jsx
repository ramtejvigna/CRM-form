import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Baby, Star, Clock, MapPin, Mail, Phone, User, Users, FileText, Calculator, Check, AtSign, Globe, Share2, CheckCircle2, XCircle, Send, Gift } from 'lucide-react';
import axios from 'axios';
import { LocationSuggestions, ApplicationIDModal } from './LocationSuggestions';
import { Instagram, Facebook } from 'lucide-react';

const GodOptions = [
  "Ganesha", "Shiva", "Vishnu", "Krishna", "Rama", "Hanuman", "Durga", "Lakshmi", "Saraswati", "Brahma", "Indra", "Agni", "Varuna", "Vayu", "Yama", "Surya", "Chandra", "Skanda", "Kubera"
];
const theme = {
  primary: '#FFB800',
  secondary: '#FFE5A3',
  accent: '#FFDB4D',
  background: '#FFF8E7',
  text: '#4A4026',
  border: '#FFD700'
};

const api = "http://localhost:9000"
const deployedAPI = "https://vedic-backend-neon.vercel.app"

const CustomNotification = ({ status, message }) => (
  <motion.div
    className={`flex items-center w-full h-full gap-4 p-4 rounded-lg shadow-lg ${status ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gradient-to-r from-red-50 to-red-100'} bg-opacity-80`}
  >
    <div className={`p-2 rounded-full ${status ? 'bg-green-200' : 'bg-red-200'}`}>
      {status ? (
        <CheckCircle2 className="w-6 h-6 text-green-600" />
      ) : (
        <XCircle className="w-6 h-6 text-red-600" />
      )}
    </div>
    <div>
      <h3 className={`font-semibold ${status ? 'text-green-800' : 'text-red-800'}`}>
        {status ? 'Success!' : 'Error'}
      </h3>
      <p className={`text-sm ${status ? 'text-green-600' : 'text-red-600'}`}>
        {message}
      </p>
    </div>
  </motion.div>
);

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    whatsappNumber: '',
    fatherName: '',
    motherName: '',
    babyGender: '',
    babyBirthDate: '',
    babyBirthTime: '',
    birthplace: '',
    preferredStartingLetterType: '',
    preferredStartingLetter: '',
    preferredGod: '',
    referenceName: '',
    additionalPreferences: '',
    leadSource: '',
    socialMediaId: '',
    otherSource: '',
    isTwins: 'no',
    selectedServices: [],
    totalPrice: 0

  });

  const [errors, setErrors] = useState({
    customerName: false,
    email: false,
    whatsappNumber: false,
    fatherName: false,
    motherName: false,
    babyGender: false,
    babyBirthDate: false,
    babyBirthTime: false,
    birthplace: false,
    preferredStartingLetterType: false,
    preferredStartingLetter: false,
    preferredGod: false,
    services: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [features, setFeatures] = useState([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const locationInputRef = useRef(null);
  const services = [
    { id: 'astro', name: 'Astrology Service', price: 399 },
    { id: 'numerology', name: 'Numerology Service', price: 150 }
  ];

  // Calculate total price when services change
  const calculateTotalPrice = (selectedServices) => {
    return selectedServices.reduce((total, service) => {
      const serviceDetails = services.find(s => s.id === service);
      return total + (serviceDetails ? serviceDetails.price : 0);
    }, 0);
  };

  const handleServiceChange = (serviceId) => {
    const updatedServices = formData.selectedServices.includes(serviceId)
      ? formData.selectedServices.filter(id => id !== serviceId)
      : [...formData.selectedServices, serviceId];

    setFormData(prev => ({
      ...prev,
      selectedServices: updatedServices,
      totalPrice: calculateTotalPrice(updatedServices)
    }));
  };

  // Add these fields to your existing formFields array
  const additionalFormFields = [
    {
      icon: <Baby />,
      label: "Twin Babies",
      name: "isTwins",
      type: "select",
      options: ["no", "yes"],
      required: true
    },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'whatsappNumber') {
      // Only allow numbers and limit to 10 digits
      const numbersOnly = value.replace(/[^0-9]/g, '');
      const limitedToTen = numbersOnly.slice(0, 10);

      setFormData(prev => ({
        ...prev,
        [name]: limitedToTen
      }));
    } else if (name === 'preferredStartingLetterType') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        preferredStartingLetter: value === 'Alphabet Based' ? prev.preferredStartingLetter : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'leadSource' && {
          socialMediaId: '',
          otherSource: ''
        })
      }));
    }
  };

  const handleLocationInput = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, birthplace: value }));

    // Clear previous timeout
    if (window.locationSuggestionsTimeout) {
      clearTimeout(window.locationSuggestionsTimeout);
    }

    // Set new timeout
    if (value.length > 2) {
      window.locationSuggestionsTimeout = setTimeout(() => {
        fetchLocationSuggestions(value);
      }, 500); // 500ms delay
    } else {
      setLocationSuggestions([]);
    }
  };

  const GEOAPIFY_API_KEY = 'fbb69e95df744d56a558e579dc900869';

  const fetchLocationSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&filter=countrycode:in&apiKey=${GEOAPIFY_API_KEY}`,
        { method: 'GET' }
      );

      const result = await response.json();

      // Transform the response to match our suggestion format
      const suggestions = result.features.map(location => ({
        PlaceName: location.properties.formatted,
        Coordinates: location.geometry.coordinates,
        Type: location.properties.place_type || 'Location'
      }));

      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error('Location suggestions error', error);
      setLocationSuggestions([]);
    }
  };

  const selectLocationSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      birthplace: suggestion.PlaceName
    }));
    setLocationSuggestions([]);
  };

  const validateForm = () => {
    let isValid = true;
    if (formData.selectedServices.length === 0) {
      setErrors(prev => ({ ...prev, services: true }));
      isValid = false;
    }

    if (formData.customerName.trim() === '') {
      setErrors(prev => ({ ...prev, customerName: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, customerName: false }));
    }

    if (formData.email.trim() === '' || !isValidEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, email: false }));
    }

    if (formData.whatsappNumber.trim() === '' || formData.whatsappNumber.length < 10) {
      setErrors(prev => ({ ...prev, whatsappNumber: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, whatsappNumber: false }));
    }

    if (formData.fatherName.trim() === '') {
      setErrors(prev => ({ ...prev, fatherName: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, fatherName: false }));
    }

    if (formData.motherName.trim() === '') {
      setErrors(prev => ({ ...prev, motherName: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, motherName: false }));
    }

    if (formData.babyGender === '') {
      setErrors(prev => ({ ...prev, babyGender: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, babyGender: false }));
    }

    if (formData.babyBirthDate === '') {
      setErrors(prev => ({ ...prev, babyBirthDate: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, babyBirthDate: false }));
    }

    if (formData.babyBirthTime === '') {
      setErrors(prev => ({ ...prev, babyBirthTime: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, babyBirthTime: false }));
    }

    if (formData.birthplace.trim() === '') {
      setErrors(prev => ({ ...prev, birthplace: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, birthplace: false }));
    }

    if (formData.preferredStartingLetterType === '') {
      setErrors(prev => ({ ...prev, preferredStartingLetterType: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, preferredStartingLetterType: false }));
    }

    if (formData.preferredStartingLetterType === 'Alphabet Based' && formData.preferredStartingLetter.trim() === '') {
      setErrors(prev => ({ ...prev, preferredStartingLetter: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, preferredStartingLetter: false }));
    }

    if (formData.preferredGod === '') {
      setErrors(prev => ({ ...prev, preferredGod: true }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, preferredGod: false }));
    }

    return isValid;
  };

  const isValidEmail = (email) => {
    // Basic email validation
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${deployedAPI}/customers/addCustomerWithAssignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setApplicationId(data.applicationId);
        setSubmitStatus({
          success: true,
          message: `Application submitted successfully!`
        });

        // Show both notification and modal
        setShowNotification(true);
        setTimeout(() => {
          setShowApplicationModal(true);
        }, 3000);

        // Reset form data
        setFormData({
          customerName: '',
          email: '',
          whatsappNumber: '',
          fatherName: '',
          motherName: '',
          babyGender: '',
          babyBirthDate: '',
          babyBirthTime: '',
          birthplace: '',
          preferredStartingLetterType: '',
          preferredStartingLetter: '',
          preferredGod: '',
          referenceName: '',
          additionalPreferences: '',
          leadSource: '',
          socialMediaId: '',
          otherSource: '',
          isTwins: '',
          selectedServices: [],
          totalPrice: 0
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Oops! Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(`${deployedAPI}/images`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setFeatures(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [])

  const formFields = [
    { icon: <User />, label: "Customer Name", name: "customerName", type: "text", placeholder: "Enter Customer Name", required: true },
    { icon: <Mail />, label: "Customer Email", name: "email", type: "email", placeholder: "Enter Customer Email", required: true },
    { icon: <Phone />, label: "Customer WhatsApp", name: "whatsappNumber", type: "text", placeholder: "Enter Customer WhatsApp Number", required: true },
    { icon: <User />, label: "Baby's Father Name", name: "fatherName", type: "text", placeholder: "Enter Baby's Father Name", required: true },
    { icon: <User />, label: "Baby's Mother Name", name: "motherName", type: "text", placeholder: "Enter Mother's Name", required: true },
    { icon: <Baby />, label: "Baby Gender", name: "babyGender", type: "select", options: ["Male", "Female"], required: true },
    { icon: <Clock />, label: "Baby Birth Date", name: "babyBirthDate", type: "date", required: true },
    { icon: <Clock />, label: "Baby Birth Time", name: "babyBirthTime", type: "time", required: true },
    { icon: <MapPin />, label: "Birthplace", name: "birthplace", type: "text", placeholder: "Enter Birthplace", required: true },
    { icon: <FileText />, label: "Preferred Starting Letter Type", name: "preferredStartingLetterType", type: "select", options: ["Alphabet Based", "Nakshatra Based", "Rashi Based"], required: true },
    { icon: <Star />, label: "Preferred God", name: "preferredGod", type: "select", options: GodOptions, required: true },
    { icon: <Users />, label: "Reference Name (if any)", name: "referenceName", type: "text", placeholder: "Enter Reference Name" },
    { icon: <FileText />, label: "Additional Preferences", name: "additionalPreferences", type: "text", placeholder: "Enter Additional Preferences" },
  ];

  const ServiceSelection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-2 mt-6 p-6 bg-yellow-50 rounded-xl"
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-yellow-600" />
        Select Services
        <span className="text-red-600 ml-1">*</span>
      </h3>

      <div className="space-y-4">
        {services.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleServiceChange(service.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${formData.selectedServices.includes(service.id)
                  ? 'bg-yellow-600 border-yellow-600'
                  : 'border-gray-300 hover:border-yellow-400'
                  }`}
              >
                {formData.selectedServices.includes(service.id) && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
              <div>
                <span className="font-medium">{service.name}</span>
                <p className="text-sm text-gray-500">
                  {service.id === 'astro'
                    ? 'Complete astrological analysis and name suggestions'
                    : 'Numerological compatibility and name analysis'
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-yellow-600 font-semibold">₹{service.price}</span>
              <p className="text-xs text-gray-500">Including GST</p>
            </div>
          </motion.div>
        ))}
      </div>

      {errors.services && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm mt-2"
        >
          Please select at least one service
        </motion.div>
      )}

      {formData.selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-white rounded-lg shadow-sm border-2 border-yellow-100"
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-gray-700">Total Amount</span>
              <p className="text-xs text-gray-500">Services selected: {formData.selectedServices.length}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-yellow-600">₹{formData.totalPrice}</span>
              <p className="text-xs text-gray-500">Including GST</p>
            </div>
          </div>
          {formData.selectedServices.length === 2 && (
            <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>You've selected both services for comprehensive analysis!</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen fixed inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl"
          >
            <motion.div
              id="paper-plane"
              className="transition-all duration-1000 ease-in-out"
            >
              <Send className="w-16 h-16 text-[#D84040]" />
            </motion.div>
            <motion.div
              className="from-yellow-100/50 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-10 transform -translate-x-1/2"
            >
              <div className="flex flex-col items-center">
                <div className="loading-dots flex space-x-2">
                  <motion.div
                    animate={{
                      y: ["0%", "-50%", "0%"],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-3 h-3 bg-yellow-600 rounded-full"
                  />
                  <motion.div
                    animate={{
                      y: ["0%", "-50%", "0%"],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                    className="w-3 h-3 bg-yellow-600 rounded-full"
                  />
                  <motion.div
                    animate={{
                      y: ["0%", "-50%", "0%"],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                    className="w-3 h-3 bg-yellow-600 rounded-full"
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-2xl font-medium text-yellow-600"
                >
                  Sending your application...
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-16 px-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-900 mb-4">
          Find the Perfect Name for Your Little One
        </h1>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4">
          at SelectBabyNames.in
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover meaningful names rooted in Vedic tradition, perfectly suited to your baby's unique birth circumstances and your family's preferences.
        </p>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className={`${features.length < 3 ? `flex flex-col items-center md:flex-row justify-around` : 'grid md:grid-cols-3'} gap-8`}>
          {features.map((feature, index) => (
            <motion.div
              key={feature._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 w-[21rem] rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <img src={feature.base64} alt={feature.title} className='h-48 w-full rounded-md' />
              <h3 className="text-xl font-semibold my-2 mt-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.caption}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-1/3 left-1/3 text-xl transform -translate-x-1/2 z-50 w-full max-w-lg px-4"
          >
            <CustomNotification
              status={submitStatus.success}
              message={submitStatus.message}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <div className="w-full min-h-screen p-4 md:p-0">
  <motion.form
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    onSubmit={handleSubmit}
    className="bg-white rounded-2xl shadow-xl p-4 md:p-8 max-w-4xl mx-auto"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {formFields.map((field, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative"
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-600">{field.icon}</span>
            <label className={`text-sm font-medium ${field.required ? 'text-slate-800' : 'text-gray-700'}`}>
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
          </div>
          <div className="relative">
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`w-full p-2 md:p-3 text-sm md:text-base border ${
                  errors[field.name]
                    ? 'border-red-300 focus:ring-2 focus:ring-red-400 focus:border-transparent'
                    : 'border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                } rounded-lg transition-all`}
              >
                <option value="">
                  {field.name === "babyGender" ? "Select Baby Gender"
                    : field.name === "preferredStartingLetterType" ? "Select Starting Letter Type"
                    : field.name === "preferredGod" ? "Select Preferred God"
                    : "Select Platform"}
                </option>
                {(field.name === "preferredGod" ? GodOptions : field.options).map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <input
                  type={field.type}
                  name={field.name}
                  ref={field.name === 'birthplace' ? locationInputRef : null}
                  value={formData[field.name]}
                  onChange={field.name === 'birthplace' ? handleLocationInput : handleChange}
                  placeholder={field.placeholder}
                  maxLength={field.name === 'whatsappNumber' ? 10 : undefined}
                  pattern={field.name === 'whatsappNumber' ? '[0-9]*' : undefined}
                  inputMode={field.name === 'whatsappNumber' ? 'numeric' : undefined}
                  className={`w-full p-2 md:p-3 text-sm md:text-base border ${
                    errors[field.name]
                      ? 'border-red-300 focus:ring-2 focus:ring-red-400 focus:border-transparent'
                      : 'border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                  } rounded-lg transition-all`}
                />
              </div>
            )}
          </div>

          {field.name === 'birthplace' && locationSuggestions.length > 0 && (
            <LocationSuggestions
              suggestions={locationSuggestions}
              onSelectSuggestion={selectLocationSuggestion}
              inputRef={locationInputRef}
            />
          )}

          {field.name === "preferredStartingLetterType" &&
           formData.preferredStartingLetterType === 'Alphabet Based' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mt-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                <label className="text-sm font-medium text-gray-700">
                  Preferred Starting Letter
                </label>
              </div>
              <input
                type="text"
                name="preferredStartingLetter"
                value={formData.preferredStartingLetter}
                onChange={handleChange}
                placeholder="Enter preferred starting letter"
                className={`w-full p-2 md:p-3 text-sm md:text-base border ${
                  errors.preferredStartingLetter
                    ? 'border-red-300 focus:ring-2 focus:ring-red-400 focus:border-transparent'
                    : 'border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                } rounded-lg transition-all`}
              />
              {errors.preferredStartingLetter && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-600 text-xs md:text-sm mt-2"
                >
                  Preferred starting letter is required
                </motion.div>
              )}
            </motion.div>
          )}

          {errors[field.name] && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-red-600 text-xs md:text-sm mt-2"
            >
              {`${field.label} is required`}
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Additional Form Fields */}
      {additionalFormFields.map((field, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative col-span-1 md:col-span-1"
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-600">{field.icon}</span>
            <label className={`text-sm font-medium ${field.required ? 'text-slate-800' : 'text-gray-700'}`}>
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
          </div>
          <select
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className={`w-full p-2 md:p-3 text-sm md:text-base border ${
              errors[field.name]
                ? 'border-red-300 focus:ring-2 focus:ring-red-400 focus:border-transparent'
                : 'border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
            } rounded-lg transition-all`}
          >
            <option value="">Select Option</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          {errors[field.name] && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-red-600 text-xs md:text-sm mt-2"
            >
              {`${field.label} is required`}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>

    {/* Service Selection Component */}
    <ServiceSelection />

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isSubmitting}
      className={`w-full mt-6 md:mt-8 bg-[#D84040] text-white py-2 md:py-3 text-sm md:text-base rounded-lg font-medium transition-all ${
        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-yellow-700 hover:to-yellow-700'
      }`}
    >
      {isSubmitting ? 'Submitting...' : 'Submit Application'}
    </motion.button>
  </motion.form>
</div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-yellow-600 via-amber-300 to-yellow-500 text-gray-800 mt-9">
      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <div className="bg-yellow-50 rounded-lg p-6 shadow-lg h-full">
              <h3 className="text-xl font-bold mb-4 text-amber-800">About Us</h3>
              <p className="text-amber-900">
                We specialize in providing meaningful Vedic names for your little ones, ensuring each name carries profound significance and positive energy.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <div className="bg-yellow-50 rounded-lg p-6 shadow-lg h-full">
              <h3 className="text-xl font-bold mb-4 text-amber-800">Contact</h3>
              <div className="space-y-3">
                <a href="mailto:Selectbabyname.in@gmail.com" 
                   className="flex items-center space-x-2 text-amber-900 hover:text-amber-600 transition-colors duration-300">
                  <Mail size={18} />
                  <span>Selectbabyname.in@gmail.com</span>
                </a>
                <a href="tel:+919699190301" 
                   className="flex items-center space-x-2 text-amber-900 hover:text-amber-600 transition-colors duration-300">
                  <Phone size={18} />
                  <span>+91 9699190301</span>
                </a>
              </div>
            </div>
          </div>

          {/* Social Section */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <div className="bg-yellow-50 rounded-lg p-6 shadow-lg h-full">
              <h3 className="text-xl font-bold mb-4 text-amber-800">Follow Us</h3>
              <div className="flex justify-center md:justify-start space-x-6">
                <a href="https://www.facebook.com/selctbabyname/" 
                   className="group">
                  <Facebook className="w-8 h-8 text-amber-900 group-hover:text-amber-600 transform group-hover:scale-110 transition-all duration-300" />
                </a>
                <a href="https://www.instagram.com/selectbabyname/" 
                   className="group">
                  <Instagram className="w-8 h-8 text-amber-900 group-hover:text-amber-600 transform group-hover:scale-110 transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-amber-400 text-center">
          <p className="text-amber-900">&copy; 2024 Vedic Name Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
      <AnimatePresence>
        {showApplicationModal && (
          <ApplicationIDModal
            applicationId={applicationId}
            onClose={() => setShowApplicationModal(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default CustomerForm;
