import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SearchVehicle() {
  const [fromPincode, setFromPincode] = useState("");
  const [toPincode, setToPincode] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!fromPincode || !toPincode) {
      setMessage("Please enter both pincodes.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await axiosInstance.get(
        `/vehicles/available?from=${fromPincode}&to=${toPincode}`
      );
      setVehicles(res.data.vehicles);
      if (res.data.vehicles.length === 0) {
        setMessage("No vehicles found for the selected route.");
      }
    } catch (err) {
      setMessage("Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (vehicleId) => {
    const startTime = new Date(); // Optional: Replace with custom modal datetime picker
    try {
      await axiosInstance.post("/bookings/create", {
        vehicleId,
        fromPincode,
        toPincode,
        startTime,
      });
      toast.success("✅ Vehicle booked successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Booking failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-slate-900 text-white p-6 pt-24">
      <h2 className="text-2xl font-bold text-center mb-6">Search Vehicles</h2>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-xl mx-auto mb-6">
        <Input
          type="number"
          placeholder="From Pincode"
          value={fromPincode}
          onChange={(e) => setFromPincode(e.target.value)}
        />
        <Input
          type="number"
          placeholder="To Pincode"
          value={toPincode}
          onChange={(e) => setToPincode(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {message && <p className="text-center text-red-400">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-6">
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle._id}
            className="bg-white/10 border border-white/20 backdrop-blur-lg shadow text-white transition hover:scale-[1.02]"
          >
            <CardContent className="p-4 space-y-2">
              {vehicle.photo && (
                <img
                  src={vehicle.photo}
                  alt={vehicle.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <CardTitle>{vehicle.name}</CardTitle>
              <p>Capacity: {vehicle.capacityKg} kg</p>
              <p>Tyres: {vehicle.tyres}</p>
              <Button
                className="w-full mt-2"
                onClick={() => handleBook(vehicle._id)}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
