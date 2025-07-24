import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "input", 
  error, 
  required = false,
  className,
  children,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select {...props}>
          {children}
        </Select>
      );
    }
    return <Input {...props} />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn("block", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
        {label}
      </Label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;