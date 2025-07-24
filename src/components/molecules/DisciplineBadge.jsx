import React from "react";
import { cn } from "@/utils/cn";

const DisciplineBadge = ({ discipline, type, className }) => {
  const getColors = () => {
    if (type === "open_water") {
      switch (discipline) {
        case "CWT":
          return "bg-primary-100 text-primary-800 border-primary-200";
        case "CWTB":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "CNF":
          return "bg-teal-100 text-teal-800 border-teal-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    } else {
      switch (discipline) {
        case "STA":
          return "bg-green-100 text-green-800 border-green-200";
        case "DYN":
          return "bg-purple-100 text-purple-800 border-purple-200";
        case "DYNB":
          return "bg-indigo-100 text-indigo-800 border-indigo-200";
        case "DNF":
          return "bg-orange-100 text-orange-800 border-orange-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
  };

  const getFullName = () => {
    const names = {
      CWT: "Constant Weight",
      CWTB: "CWT Bifins",
      CNF: "Constant No Fins",
      STA: "Static Apnea",
      DYN: "Dynamic Apnea",
      DYNB: "Dynamic Bifins", 
      DNF: "Dynamic No Fins"
    };
    return names[discipline] || discipline;
  };

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
      getColors(),
      className
    )}>
      {getFullName()}
    </span>
  );
};

export default DisciplineBadge;