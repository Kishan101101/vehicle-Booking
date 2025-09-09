import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "../../utils/axiosInstance";

export default function AddVehicle() {
  const [formData, setFormData] = useState({
    name: "",
    capacityKg: "",
    tyres: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("capacityKg", formData.capacityKg);
    data.append("tyres", formData.tyres);
    if (formData.file) data.append("file", formData.file);

    try {
      const res = await axiosInstance.post("/vehicles/add", data);
      setMessage("✅ Vehicle added successfully!");
      setFormData({ name: "", capacityKg: "", tyres: "", file: null });
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white/10 border border-white/20 backdrop-blur-lg p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Add New Vehicle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Vehicle Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            name="capacityKg"
            placeholder="Capacity (kg)"
            type="number"
            value={formData.capacityKg}
            onChange={handleChange}
            required
          />
          <Input
            name="tyres"
            placeholder="Number of Tyres"
            type="number"
            value={formData.tyres}
            onChange={handleChange}
            required
          />
          <Input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
          />

          {message && (
            <p className="text-center text-sm text-white/80">{message}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Vehicle"}
          </Button>
        </form>
      </div>
    </div>
  );
}
