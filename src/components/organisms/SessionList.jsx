import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import DisciplineBadge from "@/components/molecules/DisciplineBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { SessionService } from "@/services/api/sessionService";
import { DiveService } from "@/services/api/diveService";
import { format } from "date-fns";

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    type: "",
    discipline: "",
    location: "",
    dateFrom: "",
    dateTo: ""
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError("");
      const sessionsData = await SessionService.getAll();
      
      // Get dive counts for each session
      const sessionsWithStats = await Promise.all(
        sessionsData.map(async (session) => {
          const sessionDives = await DiveService.getBySessionId(session.Id);
          const bestValue = getBestValue(sessionDives, session);
          
          return {
            ...session,
            diveCount: sessionDives.length,
            bestValue
          };
        })
      );
      
      setSessions(sessionsWithStats);
    } catch (err) {
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const getBestValue = (dives, session) => {
    if (dives.length === 0) return null;
    
    if (session.type === "open_water") {
      const maxDepth = Math.max(...dives.map(d => d.depth || 0));
      return `${maxDepth}m`;
    } else if (session.discipline === "STA") {
      const maxTime = Math.max(...dives.map(d => d.time || 0));
      return `${maxTime}s`;
    } else {
      const maxDistance = Math.max(...dives.map(d => d.distance || 0));
      return `${maxDistance}m`;
    }
  };

const filteredSessions = sessions.filter(session => {
    if (filter.type && session.type !== filter.type) return false;
    if (filter.discipline && session.discipline !== filter.discipline) return false;
    if (filter.location && !session.location?.toLowerCase().includes(filter.location.toLowerCase())) return false;
    
    // Date range filtering
    if (filter.dateFrom) {
      const sessionDate = new Date(session.date);
      const fromDate = new Date(filter.dateFrom);
      if (sessionDate < fromDate) return false;
    }
    if (filter.dateTo) {
      const sessionDate = new Date(session.date);
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire end date
      if (sessionDate > toDate) return false;
    }
    
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent first

  // Get unique locations for filter dropdown
  const locationOptions = [...new Set(sessions
    .map(session => session.location)
    .filter(location => location && location.trim() !== "")
  )].sort();

const disciplineOptions = {
    open_water: ["CWT", "CWTB", "CNF", "FIM"],
    pool: ["STA", "DYN", "DYNB", "DNF"]
  };
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSessions} />;
  if (sessions.length === 0) return <Empty message="No dive sessions recorded yet" />;

  return (
    <div className="space-y-6">
      {/* Filters */}
<Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <FormField
            label="Session Type"
            type="select"
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value, discipline: "" }))}
          >
            <option value="">All Types</option>
            <option value="open_water">Open Water</option>
            <option value="pool">Pool</option>
          </FormField>
          
          <FormField
            label="Discipline"
            type="select"
            value={filter.discipline}
            onChange={(e) => setFilter(prev => ({ ...prev, discipline: e.target.value }))}
            disabled={!filter.type}
          >
            <option value="">All Disciplines</option>
            {filter.type && disciplineOptions[filter.type]?.map(discipline => (
              <option key={discipline} value={discipline}>{discipline}</option>
            ))}
          </FormField>
          
          <FormField
            label="Location"
            type="select"
            value={filter.location}
            onChange={(e) => setFilter(prev => ({ ...prev, location: e.target.value }))}
          >
            <option value="">All Locations</option>
            {locationOptions.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </FormField>
          
          <FormField
            label="Date From"
            type="date"
            value={filter.dateFrom}
            onChange={(e) => setFilter(prev => ({ ...prev, dateFrom: e.target.value }))}
          />
          
          <FormField
            label="Date To"
            type="date"
            value={filter.dateTo}
            onChange={(e) => setFilter(prev => ({ ...prev, dateTo: e.target.value }))}
          />
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setFilter({ type: "", discipline: "", location: "", dateFrom: "", dateTo: "" })}
            className="w-full md:w-auto"
          >
            <ApperIcon name="X" size={16} className="mr-2" />
            Clear All Filters
          </Button>
        </div>
      </Card>

      {/* Session List */}
      {filteredSessions.length === 0 ? (
        <Empty message="No sessions match your filters" />
      ) : (
<div className="space-y-4">
          {filteredSessions.map((session) => (
            <Card key={session.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image Section */}
                {session.photos && session.photos.length > 0 && (
                  <div className="lg:w-48 flex-shrink-0">
                    <img 
                      src={session.photos[0]} 
                      alt={`Dive at ${session.location}`}
                      className="w-full h-32 lg:h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold font-display text-gray-900">
                          {format(new Date(session.date), "MMM d, yyyy")}
                        </h3>
                        <DisciplineBadge 
                          discipline={session.discipline} 
                          type={session.type} 
                        />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <ApperIcon name="MapPin" size={16} className="mr-1" />
                          {session.location || "No location"}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Target" size={16} className="mr-1" />
                          {session.diveCount} dives
                        </div>
                        {session.bestValue && (
                          <div className="flex items-center">
                            <ApperIcon name="TrendingUp" size={16} className="mr-1" />
                            Best: {session.bestValue}
                          </div>
                        )}
                        {session.photos && session.photos.length > 0 && (
                          <div className="flex items-center">
                            <ApperIcon name="Camera" size={16} className="mr-1" />
                            {session.photos.length} photo{session.photos.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      
                      {session.notes && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {session.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      <Link to={`/session/${session.Id}`}>
                        <Button variant="outline" size="sm">
                          <ApperIcon name="Eye" size={16} className="mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionList;