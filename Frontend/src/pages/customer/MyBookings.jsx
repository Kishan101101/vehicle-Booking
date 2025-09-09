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
        const res = await axiosInstance.get("/vehicles/my");
        setVehicles(res.data.vehicles || []);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to load vehicles");
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

      {message && <p className="text-red-400 text-center mb-4">{message}</p>}

      {vehicles.length === 0 ? (
        <p className="text-center text-white/80">No vehicles added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {vehicles.map((v) => (
            <Card
              key={v._id}
              className="bg-white/10 border border-white/10 text-white backdrop-blur-md shadow-md"
            >
              <CardHeader>
                <CardTitle>{v.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {v.image && (
                  <img
                    src={v.image}
                    alt="Vehicle"
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                )}
                <p>
                  <strong>Capacity:</strong> {v.capacityKg} kg
                </p>
                <p>
                  <strong>Tyres:</strong> {v.tyres}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(v.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
