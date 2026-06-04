
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatientInfo } from "@/types";

interface PatientInfoFormProps {
  patient: PatientInfo;
  onPatientInfoChange: (key: keyof PatientInfo, value: string | number) => void;
}

export const PatientInfoForm = ({ patient, onPatientInfoChange }: PatientInfoFormProps) => {
  return (
    <Card>
      <CardHeader className="bg-medical-600">
        <CardTitle className="text-white">Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="patientName">Patient ID*</Label>
            <Input
              id="patientName"
              value={patient.name}
              onChange={(e) => onPatientInfoChange("name", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reportDate">Report Date</Label>
            <Input
              id="reportDate"
              type="date"
              value={patient.date}
              onChange={(e) => onPatientInfoChange("date", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
