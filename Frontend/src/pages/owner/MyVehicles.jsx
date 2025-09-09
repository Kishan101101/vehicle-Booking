import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axiosInstance.get("/vehicles/mine");
        setVehicles(res.data.vehicles);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to fetch vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-6">Loading vehicles...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-slate-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Vehicles</h2>

      {message && <p className="text-center text-red-400">{message}</p>}

      {vehicles.length === 0 ? (
        <p className="text-center text-white/80">No vehicles added yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle._id}
              className="bg-white/10 text-white border-white/20 backdrop-blur-md"
            >
              <CardHeader>
                <CardTitle>{vehicle.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Capacity: {vehicle.capacityKg} kg</p>
                <p>Tyres: {vehicle.tyres}</p>
                {vehicle.photo && (
                  <img
                    src={vehicle.photo}
                    alt={vehicle.name}
                    className="rounded mt-3 object-cover w-full h-40"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
