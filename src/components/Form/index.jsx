import React, { useState } from "react";
import axios from "axios";

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
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/customers/addCustomerWithAssignment", formData);
            console.log("Customer added successfully:", response.data);
        } catch (error) {
            console.error("Error adding customer:", error);
        }
    };

    return (
        <div className="md:flex md:flex-row min-h-screen ">
            <div className="flex flex-col justify-center items-center pt-10 md:w-1/2 md:p-20">
                <h2 className="text-4xl font-bold mb-6">CRM-vedic</h2>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
                >
                    {[
                        { label: "Father's Name", name: "fatherName", type: "text", placeholder: "Father Name" },
                        { label: "Mother's Name", name: "motherName", type: "text", placeholder: "Mother Name" },
                        { label: "Email", name: "email", type: "email", placeholder: "Email" },
                        { label: "WhatsApp Number", name: "whatsappNumber", type: "text", placeholder: "WhatsApp Number" },
                        { label: "Baby Gender", name: "babyGender", type: "select", placeholder: "Select Baby Gender", options: ["Male", "Female", "Other"] },
                        { label: "Baby Birth Date", name: "babyBirthDate", type: "date" },
                        { label: "Baby Birth Time", name: "babyBirthTime", type: "time" },
                        { label: "Birthplace", name: "birthplace", type: "text", placeholder: "Birthplace" },
                        { label: "Preferred Starting Letter", name: "preferredStartingLetter", type: "text", placeholder: "Preferred Starting Letter" },
                        { label: "Preferred God", name: "preferredGod", type: "text", placeholder: "Preferred God" },
                        { label: "Reference Name", name: "referenceName", type: "text", placeholder: "Reference Name" },
                        { label: "Additional Preferences", name: "additionalPreferences", type: "text", placeholder: "Additional Preferences" },
                    ].map((input, index) => (
                        <div className="relative mb-6" key={index}>
                            {input.type === "select" ? (
                                <>
                                    <p className="text-sm mb-2 ml-1 peer-focus:hidden">{input.placeholder}</p>
                                    <select
                                        name={input.name}
                                        value={formData[input.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                                    >
                                        {input.options.map((option, i) => (
                                            <option key={i} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <label className=" bg-white px-2 absolute left-2 top-2 text-sm text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-focus:top-[-14px] peer-focus:text-blue-400 peer-focus:text-sm transition-all duration-300 ease-in-out transform -translate-y-2 scale-75 opacity-0 peer-focus:opacity-100 peer-focus:translate-y-0">
                                        {input.label}
                                    </label>
                                </>
                            ) : (
                                <>
                                    <div className="relative mb-6" key={index}>
                                        <p className="text-sm mb-2 ml-1 peer-focus:hidden">{input.label}</p>
                                        <input
                                            type={input.type}
                                            name={input.name}
                                            value={formData[input.name]}
                                            onChange={handleChange}
                                            placeholder={input.placeholder || input.label}
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                                        />
                                    </div>

                                </>
                            )}
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
            {/* Image Container */}
            <div className="hidden w-1/2 md:flex justify-end">
                <img
                    src='../../../public/images.jpeg'
                    alt="CRM Illustration"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default CustomerForm;
