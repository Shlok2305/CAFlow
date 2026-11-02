
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function HealthCheck() {
  const [message, setMessage] = useState("Checking backend...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get("/health");
        setMessage(response.data.message);
      } catch (error) {
        setMessage("Backend connection failed!");
        console.error(error);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">
        CAFlow Backend Status
      </h2>

      <p className="mt-3">{message}</p>
    </div>
  );
}

