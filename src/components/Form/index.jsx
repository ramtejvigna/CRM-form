import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Baby, Star, Clock, MapPin, Mail, Phone, User, Users, Gift, FileText, AtSign, Globe, Share2, CheckCircle2, XCircle, Send } from 'lucide-react';


const CustomNotification = ({ status, message }) => (
    <motion.div
        className={`flex items-center w-full h-full gap-4 p-4 rounded-lg shadow-lg ${status ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gradient-to-r from-red-50 to-red-100'
            } bg-opacity-80`}
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
        fatherName: "",
        motherName: "",
        email: "",
        whatsappNumber: "",
        babyGender: "",
        babyBirthDate: "",
        babyBirthTime: "",
        birthplace: "",
        preferredStartingLetter: "",
        preferredGod: "",
        referenceName: "",
        additionalPreferences: "",
        leadSource: '',
        socialMediaId: '',
        otherSource: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Paper plane animation - moves up and to the right
        const paperPlane = document.getElementById('paper-plane');
        if (paperPlane) {
            paperPlane.style.transform = 'translate(50vw, -50vh) rotate(45deg)';
            paperPlane.style.opacity = '0';
        }

        try {
            const response = await fetch("https://vedic-backend-neon.vercel.app/customers/addCustomerWithAssignment", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Wait for 3 seconds to show the animation
            await new Promise(resolve => setTimeout(resolve, 3000));

            if (response.ok) {
                setSubmitStatus({
                    success: true,
                    message: 'Application submitted successfully! We will get back to you soon.'
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
            setShowNotification(true);
            // Reset paper plane position
            const paperPlane = document.getElementById('paper-plane');
            if (paperPlane) {
                setTimeout(() => {
                    paperPlane.style.transform = 'translate(0, 0) rotate(0deg)';
                    paperPlane.style.opacity = '1';
                }, 500);
            }
            // Hide notification after 5 seconds
            setTimeout(() => setShowNotification(false), 5000);

            setFormData({
                fatherName: "",
                motherName: "",
                email: "",
                whatsappNumber: "",
                babyGender: "",
                babyBirthDate: "",
                babyBirthTime: "",
                birthplace: "",
                preferredStartingLetter: "",
                preferredGod: "",
                referenceName: "",
                additionalPreferences: "",
                leadSource: '',
                socialMediaId: '',
                otherSource: ''
            });
        }
    };

    const features = [
        {
            image: "baby3.jpg",
            icon: <Star className="w-8 h-8 text-purple-500" />,
            title: "Vedic Name Selection",
            description: "Carefully chosen names based on ancient Vedic principles"
        },
        {
            image: "baby2.jpeg",
            icon: <Heart className="w-8 h-8 text-red-500" />,
            title: "Personalized Service",
            description: "Names tailored to your preferences and cultural background"
        },
        {
            image: "pexels-samrana3003-1442005.jpg",
            icon: <Gift className="w-8 h-8 text-blue-500" />,
            title: "Meaning & Significance",
            description: "Detailed explanation of name meanings and their significance"
        }
    ];

    const formFields = [
        { icon: <User />, label: "Father's Name", name: "fatherName", type: "text", placeholder: "Enter father's name" },
        { icon: <User />, label: "Mother's Name", name: "motherName", type: "text", placeholder: "Enter mother's name" },
        { icon: <Mail />, label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
        { icon: <Phone />, label: "WhatsApp Number", name: "whatsappNumber", type: "text", placeholder: "Enter WhatsApp number" },
        { icon: <Baby />, label: "Baby Gender", name: "babyGender", type: "select", options: ["Male", "Female", "Other"] },
        { icon: <Clock />, label: "Baby Birth Date", name: "babyBirthDate", type: "date" },
        { icon: <Clock />, label: "Baby Birth Time", name: "babyBirthTime", type: "time" },
        { icon: <MapPin />, label: "Birthplace", name: "birthplace", type: "text", placeholder: "Enter birthplace" },
        { icon: <FileText />, label: "Preferred Starting Letter", name: "preferredStartingLetter", type: "text", placeholder: "Enter preferred letter" },
        { icon: <Star />, label: "Preferred God", name: "preferredGod", type: "text", placeholder: "Enter preferred deity" },
        { icon: <Users />, label: "Reference Name (if any)", name: "referenceName", type: "text", placeholder: "Enter reference name" },
        { icon: <FileText />, label: "Additional Preferences", name: "additionalPreferences", type: "text", placeholder: "Enter additional preferences" },
        { icon: <Share2 className="w-5 h-5 text-purple-600" />, label: "Could you let us know where you first heard about us?", name: "leadSource", type: "select", options: ['Instagram', 'Facebook', 'Our Website', 'Other'] }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
                            <Send className="w-16 h-16 text-purple-600" />
                        </motion.div>
                        <motion.div
                            className="from-purple-100/50 to-transparent"
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
                                        className="w-3 h-3 bg-purple-600 rounded-full"
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
                                        className="w-3 h-3 bg-purple-600 rounded-full"
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
                                        className="w-3 h-3 bg-purple-600 rounded-full"
                                    />
                                </div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-4 text-2xl font-medium text-purple-600"
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
                <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
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
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <img src={feature.image} alt={feature.image} className='h-48 w-full rounded-md' />
                            <div className="my-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
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
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        {formFields.map((field, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    {field.icon}
                                    <label className="text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                </div>
                                {field.type === "select" ? (
                                    <select
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                    >
                                        <option value="">
                                            {field.name === "babyGender" ? "Select Gender" : "Select Platform"}</option>
                                        {field.options.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        maxLength={field.name === 'whatsappNumber' ? 10 : undefined}
                                        pattern={field.name === 'whatsappNumber' ? '[0-9]*' : undefined}
                                        inputMode={field.name === 'whatsappNumber' ? 'numeric' : undefined}
                                        className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all}`}
                                    />
                                )}
                            </motion.div>
                        ))}

                        {(formData.leadSource === 'Instagram' || formData.leadSource === 'Facebook') && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <AtSign className="w-5 h-5 text-purple-600" />
                                    <label className="text-sm font-medium text-gray-700">
                                        {formData.leadSource} ID
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    name="socialMediaId"
                                    value={formData.socialMediaId}
                                    onChange={handleChange}
                                    placeholder={`Enter your ${formData.leadSource} ID`}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                />
                            </motion.div>
                        )}

                        {formData.leadSource === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <Globe className="w-5 h-5 text-purple-600" />
                                    <label className="text-sm font-medium text-gray-700">
                                        Please specify the source
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    name="otherSource"
                                    value={formData.otherSource}
                                    onChange={handleChange}
                                    placeholder="Please specify where you heard about us"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                />
                            </motion.div>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-700 hover:to-indigo-700'
                            }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </motion.button>
                </motion.form>
            </div>

            {/* Footer */}
            <footer className="bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About Us</h3>
                            <p className="text-gray-600">We specialize in providing meaningful Vedic names for your little ones, ensuring each name carries profound significance and positive energy.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <p className="text-gray-600">Email: support@vedicnames.com</p>
                            <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                            <div className="flex justify-center md:justify-start space-x-4">
                                <a href="#" className="text-gray-600 hover:text-purple-600">Facebook</a>
                                <a href="#" className="text-gray-600 hover:text-purple-600">Instagram</a>
                                <a href="#" className="text-gray-600 hover:text-purple-600">Twitter</a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
                        <p>&copy; 2024 Vedic Name Services. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CustomerForm;