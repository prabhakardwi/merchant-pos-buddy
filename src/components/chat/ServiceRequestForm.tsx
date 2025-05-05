
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_REQUEST_FIELDS, TIME_SLOTS, REQUEST_TYPE_LABELS } from "@/constants/chatbot";
import { ServiceRequest, RequestType } from "@/types/chatbot";
import { getCurrentDate, getOneMonthFromNow, generateTicketNumber } from "@/utils/chatbot";

interface ServiceRequestFormProps {
  requestType: RequestType;
  onComplete: (request: ServiceRequest) => void;
  onCancel: () => void;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  requestType,
  onComplete,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<ServiceRequest, "ticketNumber">>({
    merchantName: "",
    merchantId: "",
    serialNumber: "",
    requestType,
    preferredDate: "",
    preferredTime: "",
    contactName: "",
    contactMobile: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Omit<ServiceRequest, "ticketNumber">, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is filled
    if (errors[field] && value.trim()) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check all fields are filled
    (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = `${SERVICE_REQUEST_FIELDS[key]?.label || key} is required`;
      }
    });

    // Mobile number validation
    if (formData.contactMobile && !/^\d{10}$/.test(formData.contactMobile)) {
      newErrors.contactMobile = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Generate ticket number and complete the request
      const ticketNumber = generateTicketNumber();
      onComplete({
        ...formData,
        ticketNumber
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm w-full">
      <h3 className="text-lg font-medium mb-4">
        {REQUEST_TYPE_LABELS[requestType]} Request Form
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Merchant Name */}
        <div className="space-y-2">
          <Label htmlFor="merchantName">
            {SERVICE_REQUEST_FIELDS.merchantName.label} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="merchantName"
            value={formData.merchantName}
            onChange={(e) => handleChange("merchantName", e.target.value)}
            placeholder={SERVICE_REQUEST_FIELDS.merchantName.placeholder}
            className={errors.merchantName ? "border-red-500" : ""}
          />
          {errors.merchantName && (
            <p className="text-red-500 text-xs">{errors.merchantName}</p>
          )}
        </div>

        {/* Merchant ID */}
        <div className="space-y-2">
          <Label htmlFor="merchantId">
            {SERVICE_REQUEST_FIELDS.merchantId.label} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="merchantId"
            value={formData.merchantId}
            onChange={(e) => handleChange("merchantId", e.target.value)}
            placeholder={SERVICE_REQUEST_FIELDS.merchantId.placeholder}
            className={errors.merchantId ? "border-red-500" : ""}
          />
          {errors.merchantId && (
            <p className="text-red-500 text-xs">{errors.merchantId}</p>
          )}
        </div>

        {/* Serial Number */}
        <div className="space-y-2">
          <Label htmlFor="serialNumber">
            {SERVICE_REQUEST_FIELDS.serialNumber.label} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => handleChange("serialNumber", e.target.value)}
            placeholder={SERVICE_REQUEST_FIELDS.serialNumber.placeholder}
            className={errors.serialNumber ? "border-red-500" : ""}
          />
          {errors.serialNumber && (
            <p className="text-red-500 text-xs">{errors.serialNumber}</p>
          )}
        </div>

        {/* Preferred Date */}
        <div className="space-y-2">
          <Label htmlFor="preferredDate">
            {SERVICE_REQUEST_FIELDS.preferredDate.label} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="preferredDate"
            type="date"
            min={getCurrentDate()}
            max={getOneMonthFromNow()}
            value={formData.preferredDate}
            onChange={(e) => handleChange("preferredDate", e.target.value)}
            className={errors.preferredDate ? "border-red-500" : ""}
          />
          {errors.preferredDate && (
            <p className="text-red-500 text-xs">{errors.preferredDate}</p>
          )}
        </div>

        {/* Preferred Time */}
        <div className="space-y-2">
          <Label htmlFor="preferredTime">
            {SERVICE_REQUEST_FIELDS.preferredTime.label} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.preferredTime}
            onValueChange={(value) => handleChange("preferredTime", value)}
          >
            <SelectTrigger 
              id="preferredTime"
              className={errors.preferredTime ? "border-red-500" : ""}
            >
              <SelectValue placeholder={SERVICE_REQUEST_FIELDS.preferredTime.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferredTime && (
            <p className="text-red-500 text-xs">{errors.preferredTime}</p>
          )}
        </div>

        {/* Contact Person */}
        <div className="space-y-2">
          <Label htmlFor="contactName">
            {SERVICE_REQUEST_FIELDS.contactName.label} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => handleChange("contactName", e.target.value)}
            placeholder={SERVICE_REQUEST_FIELDS.contactName.placeholder}
            className={errors.contactName ? "border-red-500" : ""}
          />
          {errors.contactName && (
            <p className="text-red-500 text-xs">{errors.contactName}</p>
          )}
        </div>

        {/* Contact Mobile */}
        <div className="space-y-2">
          <Label htmlFor="contactMobile">
            {SERVICE_REQUEST_FIELDS.contactMobile.label} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contactMobile"
            value={formData.contactMobile}
            onChange={(e) => handleChange("contactMobile", e.target.value)}
            placeholder={SERVICE_REQUEST_FIELDS.contactMobile.placeholder}
            className={errors.contactMobile ? "border-red-500" : ""}
          />
          {errors.contactMobile && (
            <p className="text-red-500 text-xs">{errors.contactMobile}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRequestForm;
