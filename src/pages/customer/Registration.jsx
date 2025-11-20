import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { registrationAPI } from "../../services/api";

export default function Registration() {
  const [step, setStep] = useState(1);
  const [registrationId, setRegistrationId] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    nationality: "",
    experience_years: "",
    previous_roles: "",
    skills: "",
    preferred_country: "",
    preferred_city: "",
    cv: null,
    payment: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("registration");
    if (saved) {
      const data = JSON.parse(saved);
      setFormData(data.formData);
      setStep(data.step);
      setRegistrationId(data.id);
    }
  }, []);

  const saveProgress = (newStep) => {
    localStorage.setItem(
      "registration",
      JSON.stringify({ formData, step: newStep, id: registrationId })
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cv: e.target.files[0] });
  };

  const handlePaymentChange = (e) => {
    setFormData({ ...formData, payment: e.target.files[0] });
  };

  const nextStep = async () => {
    if (step === 1 && !registrationId) {
      try {
        const res = await registrationAPI.start({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          nationality: formData.nationality,
        });
        setRegistrationId(res.data.id);
        saveProgress(step + 1);
        setStep(step + 1);
      } catch (error) {
        alert(error.response?.data?.detail || "Error creating registration");
      }
    } else if (registrationId) {
      try {
        await registrationAPI.update(registrationId, {
          ...formData,
          current_step: step + 1,
        });
        saveProgress(step + 1);
        setStep(step + 1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const prevStep = () => {
    saveProgress(step - 1);
    setStep(step - 1);
  };

  const submitForm = async () => {
    try {
      // Upload CV if provided
      if (formData.cv) {
        await registrationAPI.uploadCV(registrationId, formData.cv);
      }
      
      // Upload payment if provided
      if (formData.payment) {
        await registrationAPI.uploadPayment(registrationId, formData.payment);
      }
      
      // Update registration status (only if payment upload didn't already set it)
      if (!formData.payment) {
        await registrationAPI.update(registrationId, {
          current_step: 5,
          status: "submitted",
        });
      }
      
      localStorage.removeItem("registration");
      alert("Registration submitted successfully!");
      window.location.href = "/";
    } catch (error) {
      alert("Error submitting registration: " + (error.response?.data?.detail || error.message));
    }
  };

  const steps = [
    "Personal Details",
    "Experience",
    "Preferences",
    "Upload Documents",
    "Review",
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
        Registration
      </h1>

      {/* Progress Bar */}
      <div className="flex justify-between mb-8">
        {steps.map((label, idx) => (
          <div key={idx} className="flex-1">
            <div
              className={`h-2 ${
                idx + 1 <= step ? "bg-blue-600" : "bg-gray-300"
              } ${idx !== 0 ? "ml-2" : ""}`}
            />
            <p
              className={`text-sm mt-2 ${
                idx + 1 === step ? "font-bold" : ""
              } dark:text-white`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        {step === 1 && (
          <div className="space-y-4">
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Nationality"
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              name="experience_years"
              type="number"
              value={formData.experience_years}
              onChange={handleChange}
              placeholder="Years of Experience"
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
            />
            <textarea
              name="previous_roles"
              value={formData.previous_roles}
              onChange={handleChange}
              placeholder="Previous Roles"
              className="w-full p-3 border rounded h-32 dark:bg-gray-700 dark:text-white"
            />
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills"
              className="w-full p-3 border rounded h-32 dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <select
              name="preferred_country"
              value={formData.preferred_country}
              onChange={handleChange}
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Country</option>
              <option>Germany</option>
              <option>France</option>
              <option>Netherlands</option>
              <option>Belgium</option>
              <option>Austria</option>
            </select>
            <input
              name="preferred_city"
              value={formData.preferred_city}
              onChange={handleChange}
              placeholder="Preferred City"
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2 dark:text-white">
                Upload Your CV
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              />
              {formData.cv && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  ✓ Selected: {formData.cv.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2 dark:text-white">
                Upload Your Payment Proof
              </label>
              <input
                type="file"
                onChange={handlePaymentChange}
                accept=".pdf,.doc,.docx,image/*"
                className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              />
              {formData.payment && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  ✓ Selected: {formData.payment.name}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-2 dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Review Your Information</h2>
            <p>
              <strong>Name:</strong> {formData.first_name} {formData.last_name}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Phone:</strong> {formData.phone}
            </p>
            <p>
              <strong>Date of Birth:</strong> {formData.date_of_birth}
            </p>
            <p>
              <strong>Nationality:</strong> {formData.nationality}
            </p>
            <p>
              <strong>Experience:</strong> {formData.experience_years} years
            </p>
            <p>
              <strong>Preferred Country:</strong> {formData.preferred_country}
            </p>
            <p>
              <strong>Preferred City:</strong> {formData.preferred_city}
            </p>
            <p>
              <strong>CV:</strong> {formData.cv?.name || "Not uploaded"}
            </p>
            <p>
              <strong>Payment Proof:</strong> {formData.payment?.name || "Not uploaded"}
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex items-center px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <ArrowLeft className="mr-2" size={20} /> Back
            </button>
          )}
          {step < 5 && (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
            >
              Next <ArrowRight className="ml-2" size={20} />
            </button>
          )}
          {step === 5 && (
            <button
              onClick={submitForm}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
            >
              Submit <Check className="ml-2" size={20} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}