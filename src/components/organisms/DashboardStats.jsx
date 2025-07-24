import React, { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { SessionService } from "@/services/api/sessionService";
import { DiveService } from "@/services/api/diveService";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalDives: 0,
    maxDepth: 0,
    maxDistance: 0,
    maxTime: 0,
    recentSessions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      const sessions = await SessionService.getAll();
      const allDives = await DiveService.getAll();
      
      // Calculate max values by discipline type
      const openWaterDives = allDives.filter(dive => dive.depth !== null);
      const poolDistanceDives = allDives.filter(dive => dive.distance !== null);
      const staticDives = allDives.filter(dive => dive.time !== null);
      
      const maxDepth = openWaterDives.length > 0 
        ? Math.max(...openWaterDives.map(d => d.depth))
        : 0;
        
      const maxDistance = poolDistanceDives.length > 0
        ? Math.max(...poolDistanceDives.map(d => d.distance))
        : 0;
        
      const maxTime = staticDives.length > 0
        ? Math.max(...staticDives.map(d => d.time))
        : 0;

      // Get recent sessions (last 5)
      const recentSessions = sessions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setStats({
        totalSessions: sessions.length,
        totalDives: allDives.length,
        maxDepth,
        maxDistance,
        maxTime,
        recentSessions
      });
    } catch (err) {
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStats} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Total Sessions"
        value={stats.totalSessions}
        icon="Calendar"
        className="bg-primary-50 border-primary-200"
      />
      
      <MetricCard
        title="Total Dives"
        value={stats.totalDives}
        icon="Target"
        className="bg-blue-50 border-blue-200"
      />
      
      <MetricCard
        title="Max Depth"
        value={stats.maxDepth}
        unit="m"
        icon="ArrowDown"
        gradient={true}
      />
      
      <MetricCard
        title="Max Distance"
        value={stats.maxDistance}
        unit="m"
        icon="ArrowRight"
        className="bg-purple-50 border-purple-200"
      />
      
      <MetricCard
        title="Best Static Time"
        value={stats.maxTime > 0 ? formatTime(stats.maxTime) : "0:00"}
        icon="Clock"
        className="bg-green-50 border-green-200"
      />
      
      <MetricCard
        title="Recent Activity"
        value={stats.recentSessions.length}
        unit="sessions"
        icon="Activity"
        className="bg-orange-50 border-orange-200"
      />
    </div>
  );
};

export default DashboardStats;