import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { DiveService } from "@/services/api/diveService";
import { UserService } from "@/services/api/userService";
import { SessionService } from "@/services/api/sessionService";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import DisciplineBadge from "@/components/molecules/DisciplineBadge";
import FormField from "@/components/molecules/FormField";

const SessionForm = () => {
  const navigate = useNavigate();
  const { user, isInstructor } = useAuth();
const [sessionData, setSessionData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    type: "",
    discipline: "",
    location: "",
    instructorId: "",
    buddyName: "",
    safetyNotes: "",
    moodLog: "",
    diveDuration: "",
    weather: "",
    waveCondition: "",
    currentStrength: "",
    waterVisibility: ""
  });
  
  const [dives, setDives] = useState([]);
const [currentDive, setCurrentDive] = useState({
    depth: "",
    distance: "",
    time: ""
  });
  
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

const loadInstructors = async () => {
    try {
      const instructorData = await UserService.getInstructors();
      setInstructors(instructorData);
    } catch (error) {
      console.error('Failed to load instructors:', error);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

const disciplineOptions = {
    open_water: [
      { value: "CWT", label: "Constant Weight (CWT)" },
      { value: "CWTB", label: "Constant Weight with BI-fins (CWTB)" },
      { value: "CNF", label: "Constant Weight No Fins (CNF)" },
      { value: "FIM", label: "Free Immersion (FIM)" }
    ],
    pool: [
      { value: "STA", label: "Static Apnea (STA)" },
      { value: "DYN", label: "Dynamic With Fins (DYN)" },
      { value: "DYNB", label: "Dynamic Bifins (DYNB)" },
      { value: "DNF", label: "Dynamic No Fins (DNF)" }
    ]
  };

  const handleSessionChange = (field, value) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value,
      ...(field === "type" && { discipline: "" })
    }));
  };

  const handleDiveChange = (field, value) => {
    setCurrentDive(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addDive = () => {
    const { type, discipline } = sessionData;
    
    if (!type || !discipline) {
      toast.error("Please select session type and discipline first");
      return;
    }

    let isValid = false;
    let value = 0;

    if (type === "open_water" && currentDive.depth) {
      isValid = true;
      value = parseFloat(currentDive.depth);
    } else if (type === "pool") {
      if (discipline === "STA" && currentDive.time) {
        isValid = true;
        value = parseFloat(currentDive.time);
      } else if (discipline !== "STA" && currentDive.distance) {
        isValid = true;
        value = parseFloat(currentDive.distance);
      }
    }

    if (!isValid) {
      toast.error("Please enter the required measurement for this discipline");
      return;
    }

const newDive = {
      Id: dives.length + 1,
      depth: type === "open_water" ? parseFloat(currentDive.depth) || null : null,
      distance: type === "pool" && discipline !== "STA" ? parseFloat(currentDive.distance) || null : null,
      time: discipline === "STA" ? parseFloat(currentDive.time) || null : null,
      timestamp: new Date().toISOString()
    };

    setDives(prev => [...prev, newDive]);
    setCurrentDive({ depth: "", distance: "", time: "" });
    toast.success("Dive added successfully");
};

  const removeDive = (diveId) => {
    setDives(prev => prev.filter(dive => dive.Id !== diveId));
    toast.success("Dive removed");
  };

const handlePhotoUpload = (e) => {
    // Add null checks to prevent runtime errors
    if (!e?.target?.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

const saveSession = async () => {
    if (!sessionData.type || !sessionData.discipline || dives.length === 0) {
      toast.error("Please complete session details and add at least one dive");
      return;
    }

    setLoading(true);
    
    try {
const session = await SessionService.create({
        date: sessionData.date,
        type: sessionData.type,
        discipline: sessionData.discipline,
        location: sessionData.location,
        instructorId: sessionData.instructorId ? parseInt(sessionData.instructorId) : null,
        buddyName: sessionData.buddyName,
        safetyNotes: sessionData.safetyNotes,
        moodLog: sessionData.moodLog,
        diveDuration: sessionData.diveDuration ? parseFloat(sessionData.diveDuration) : null,
        weather: sessionData.weather || "",
        waveCondition: sessionData.waveCondition || "",
        currentStrength: sessionData.currentStrength || "",
        waterVisibility: sessionData.waterVisibility ? parseFloat(sessionData.waterVisibility) : null,
        userId: user.Id
      });

      for (const dive of dives) {
        await DiveService.create({
          ...dive,
          sessionId: session.Id
        });
      }

      toast.success("Session saved successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to save session");
    } finally {
      setLoading(false);
    }
  };

  const renderDiveInput = () => {
    const { type, discipline } = sessionData;
    
    if (!type || !discipline) return null;

    if (type === "open_water") {
      return (
        <FormField
          label="Depth"
          type="number"
value={currentDive.depth}
          onChange={(e) => handleDiveChange("depth", e.target.value)}
          placeholder="Enter depth in meters, and should be in negative values"
          step="0.1"
          min="0"
        />
      );
    } else if (type === "pool") {
      if (discipline === "STA") {
        return (
          <FormField
            label="Time"
            type="number"
            value={currentDive.time}
            onChange={(e) => handleDiveChange("time", e.target.value)}
            placeholder="Enter time in seconds"
            step="1"
            min="0"
          />
        );
      } else {
        return (
          <FormField
            label="Distance"
            type="number"
            value={currentDive.distance}
            onChange={(e) => handleDiveChange("distance", e.target.value)}
            placeholder="Enter distance in meters"
            step="1"
            min="0"
          />
        );
      }
    }
  };

  const getDiveDisplayValue = (dive) => {
    const { type, discipline } = sessionData;
    
    if (type === "open_water") {
      return `${dive.depth}m`;
    } else if (discipline === "STA") {
      return `${dive.time}s`;
    } else {
      return `${dive.distance}m`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Setup */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">
          Session Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Date"
            type="date"
            value={sessionData.date}
            onChange={(e) => handleSessionChange("date", e.target.value)}
            required
          />
          
          <FormField
            label="Session Type"
            type="select"
            value={sessionData.type}
            onChange={(e) => handleSessionChange("type", e.target.value)}
            required
          >
            <option value="">Select session type</option>
            <option value="open_water">Open Water Freediving</option>
            <option value="pool">Confined Water (Pool) Freediving</option>
          </FormField>
        </div>

        {sessionData.type && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              label="Discipline"
              type="select"
              value={sessionData.discipline}
              onChange={(e) => handleSessionChange("discipline", e.target.value)}
              required
            >
              <option value="">Select discipline</option>
              {disciplineOptions[sessionData.type]?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormField>
<FormField
              label="Location"
              value={sessionData.location}
              onChange={(e) => handleSessionChange("location", e.target.value)}
              placeholder="Enter dive location"
            />
          </div>
)}

        {/* Photo Upload */}
        {sessionData.type && sessionData.discipline && (
          <div className="mt-4">
            <FormField
              label="Session Photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            {photoPreview && (
              <div className="mt-3">
                <img 
                  src={photoPreview} 
                  alt="Session preview" 
                  className="w-32 h-24 object-cover rounded-lg border"
/>
              </div>
            )}
          </div>
        )}

{/* Instructor and Safety Information */}
        {sessionData.type && sessionData.discipline && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              label="Instructor/Coach"
              type="select"
              value={sessionData.instructorId}
              onChange={(e) => handleSessionChange("instructorId", e.target.value)}
            >
              <option value="">No instructor supervision</option>
              {instructors.map(instructor => (
                <option key={instructor.Id} value={instructor.Id}>
                  {instructor.firstName} {instructor.lastName} ({instructor.role})
                </option>
              ))}
            </FormField>
            
<FormField
              label="Dive Buddy"
              value={sessionData.buddyName}
              onChange={(e) => handleSessionChange("buddyName", e.target.value)}
              placeholder="Safety buddy or diving partner"
            />
          </div>
        )}

<div className="grid grid-cols-1 gap-4 mt-4">
          <FormField
            label="Dive Notes"
            value={sessionData.safetyNotes}
            onChange={(e) => handleSessionChange("safetyNotes", e.target.value)}
            placeholder="Key takeaways, purpose of dive, other observations like rare marine encounters or experience."
            rows={2}
          />
        </div>
</Card>

      {/* Recorded Dives */}
      {dives.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">
            Recorded Dives ({dives.length})
          </h2>
          
          <div className="space-y-3">
            {dives.map((dive, index) => (
              <div key={dive.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getDiveDisplayValue(dive)}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDive(dive.Id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
      {/* Additional Information */}
      {sessionData.type && sessionData.discipline && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">
            Additional Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Dive Duration (minutes)"
              type="number"
              value={sessionData.diveDuration}
              onChange={(e) => handleSessionChange("diveDuration", e.target.value)}
              placeholder="Total session duration"
              step="1"
              min="0"
            />
            
<FormField
              label="Weather Condition"
              type="select"
              value={sessionData.weather}
              onChange={(e) => handleSessionChange("weather", e.target.value)}
            >
              <option value="">Select weather</option>
              <option value="sunny">Sunny</option>
              <option value="cloudy">Cloudy</option>
              <option value="rainy">Rainy</option>
              <option value="snow">Snow</option>
              <option value="overcast">Overcast</option>
            </FormField>
            
            <FormField
              label="Wave Condition"
              type="select"
              value={sessionData.waveCondition}
              onChange={(e) => handleSessionChange("waveCondition", e.target.value)}
            >
              <option value="">Select wave condition</option>
              <option value="no_wave">No Wave</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
<FormField
              label="Water Current Strength"
              type="select"
              value={sessionData.currentStrength}
              onChange={(e) => handleSessionChange("currentStrength", e.target.value)}
            >
              <option value="">Select current strength</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </FormField>
            
            <FormField
              label="Water Visibility (meters)"
              type="number"
              value={sessionData.waterVisibility}
              onChange={(e) => handleSessionChange("waterVisibility", e.target.value)}
              placeholder="Depth of visibility"
              step="0.5"
              min="0"
            />
          </div>

          {/* Mood Log */}
<div className="mt-4">
            <FormField
              label="Dive Mood (How was your dive?)"
              type="select"
              value={sessionData.moodLog}
              onChange={(e) => handleSessionChange("moodLog", e.target.value)}
            >
              <option value="">Select your experience</option>
              <option value="very_pleasant">Very Pleasant</option>
              <option value="pleasant">Pleasant</option>
              <option value="slightly_pleasant">Slightly Pleasant</option>
              <option value="neutral">Neutral</option>
              <option value="slightly_unpleasant">Slightly Unpleasant</option>
              <option value="unpleasant">Unpleasant</option>
              <option value="very_unpleasant">Very Unpleasant</option>
            </FormField>
          </div>
</Card>
      )}

      {/* Dive Entry */}
      {sessionData.type && sessionData.discipline && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-display text-gray-900">
              Add Dive
            </h2>
            <DisciplineBadge 
              discipline={sessionData.discipline} 
              type={sessionData.type} 
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {renderDiveInput()}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={addDive} className="w-full md:w-auto">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Dive
            </Button>
          </div>
        </Card>
      )}

      {/* Save Session */}
      {dives.length > 0 && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={saveSession}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Saving Session...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  Save Session
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SessionForm;