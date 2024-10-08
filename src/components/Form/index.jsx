import React, { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
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

    const [page, setPage] = useState(1);

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

    const handleNextPage = () => setPage((prevPage) => prevPage + 1);
    const handlePreviousPage = () => setPage((prevPage) => prevPage - 1);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Add Customer</h2>

                {/* Page 1 */}
                {page === 1 && (
                    <>
                        <TextField
                            label="Father's Name"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Mother's Name"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <Button
                            onClick={handleNextPage}
                            variant="contained"
                            color="primary"
                            fullWidth
                            className="mt-6"
                        >
                            Next
                        </Button>
                    </>
                )}

                {/* Page 2 */}
                {page === 2 && (
                    <>
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="WhatsApp Number"
                            name="whatsappNumber"
                            value={formData.whatsappNumber}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Baby Gender"
                            name="babyGender"
                            value={formData.babyGender}
                            onChange={handleChange}
                            select
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>

                        <div className="flex justify-between">
                            <Button
                                onClick={handlePreviousPage}
                                variant="contained"
                                fullWidth
                                className="mt-6 mr-2"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleNextPage}
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="mt-6 ml-2"
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}

                {/* Page 3 */}
                {page === 3 && (
                    <>
                        <TextField
                            label="Baby Birth Date"
                            name="babyBirthDate"
                            value={formData.babyBirthDate}
                            onChange={handleChange}
                            type="date"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Baby Birth Time"
                            name="babyBirthTime"
                            value={formData.babyBirthTime}
                            onChange={handleChange}
                            type="time"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Birthplace"
                            name="birthplace"
                            value={formData.birthplace}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />

                        <div className="flex justify-between">
                            <Button
                                onClick={handlePreviousPage}
                                variant="contained"
                                fullWidth
                                className="mt-6 mr-2"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleNextPage}
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="mt-6 ml-2"
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}

                {/* Page 4 */}
                {page === 4 && (
                    <>
                        <TextField
                            label="Preferred Starting Letter"
                            name="preferredStartingLetter"
                            value={formData.preferredStartingLetter}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Preferred God"
                            name="preferredGod"
                            value={formData.preferredGod}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Reference Name"
                            name="referenceName"
                            value={formData.referenceName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Additional Preferences"
                            name="additionalPreferences"
                            value={formData.additionalPreferences}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />

                        <div className="flex justify-between">
                            <Button
                                onClick={handlePreviousPage}
                                variant="contained"
                                fullWidth
                                className="mt-6 mr-2"
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="mt-6 ml-2"
                            >
                                Submit
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default CustomerForm;
