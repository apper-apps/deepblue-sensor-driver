import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import DisciplineBadge from "@/components/molecules/DisciplineBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { SessionService } from "@/services/api/sessionService";
import { DiveService } from "@/services/api/diveService";
import { format } from "date-fns";

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [dives, setDives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSessionDetail();
  }, [id]);

  const loadSessionDetail = async () => {
    try {
      setLoading(true);
      setError("");
      
      const sessionData = await SessionService.getById(parseInt(id));
      const divesData = await DiveService.getBySessionId(parseInt(id));
      
      setSession(sessionData);
      setDives(divesData);
    } catch (err) {
      setError("Session not found");
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async () => {
    if (!confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete all dives first
      for (const dive of dives) {
        await DiveService.delete(dive.Id);
      }
      
      // Then delete the session
      await SessionService.delete(session.Id);
      
      toast.success("Session deleted successfully");
      navigate("/history");
    } catch (err) {
      toast.error("Failed to delete session");
    }
  };

  const getDiveValue = (dive) => {
    if (session.type === "open_water") {
      return `${dive.depth}m depth`;
    } else if (session.discipline === "STA") {
      const mins = Math.floor(dive.time / 60);
      const secs = dive.time % 60;
      return `${mins}:${secs.toString().padStart(2, "0")} time`;
    } else {
      return `${dive.distance}m distance`;
    }
  };

  const getBestValue = () => {
    if (dives.length === 0) return null;
    
    if (session.type === "open_water") {
      const maxDepth = Math.max(...dives.map(d => d.depth || 0));
      return `${maxDepth}m`;
    } else if (session.discipline === "STA") {
      const maxTime = Math.max(...dives.map(d => d.time || 0));
      const mins = Math.floor(maxTime / 60);
      const secs = maxTime % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    } else {
      const maxDistance = Math.max(...dives.map(d => d.distance || 0));
      return `${maxDistance}m`;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!session) return <Error message="Session not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/history" 
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back to History
        </Link>
        
        <Button
          variant="danger"
          size="sm"
          onClick={deleteSession}
        >
          <ApperIcon name="Trash2" size={16} className="mr-2" />
          Delete Session
        </Button>
      </div>

      {/* Session Overview */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">
              {format(new Date(session.date), "EEEE, MMMM d, yyyy")}
            </h1>
            <div className="flex items-center space-x-3">
              <DisciplineBadge 
                discipline={session.discipline} 
                type={session.type} 
              />
              <span className="text-sm text-gray-600">
                {session.type === "open_water" ? "Open Water" : "Pool"} Session
              </span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 text-right">
            <p className="text-sm text-gray-600">Best Performance</p>
            <p className="text-2xl font-bold font-display text-primary-700">
              {getBestValue() || "No data"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Location</h3>
            <p className="text-gray-600 flex items-center">
              <ApperIcon name="MapPin" size={16} className="mr-2" />
              {session.location || "No location specified"}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Total Dives</h3>
            <p className="text-gray-600 flex items-center">
              <ApperIcon name="Target" size={16} className="mr-2" />
              {dives.length} dives recorded
            </p>
          </div>
        </div>

        {session.notes && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Session Notes</h3>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
              {session.notes}
            </p>
          </div>
        )}
      </Card>

      {/* Dives List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">
          Individual Dives
        </h2>
        
        {dives.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Target" size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No dives recorded for this session</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dives.map((dive, index) => (
              <div key={dive.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getDiveValue(dive)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(dive.timestamp), "h:mm a")}
                    </p>
                    {dive.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        {dive.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SessionDetail;