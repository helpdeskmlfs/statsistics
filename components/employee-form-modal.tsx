"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Employee {
  id: number
  name: string
  department: string
  "Red Flag": number
  Onhold: number
  "Assisted Ticket": number
  Late: number
}

interface EmployeeFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (employee: Employee) => void
  employee?: Employee | null
  mode: "add" | "edit"
}

export default function EmployeeFormModal({ isOpen, onClose, onSave, employee, mode }: EmployeeFormModalProps) {
  const [formData, setFormData] = useState<Employee>({
    id: employee?.id || Date.now(),
    name: employee?.name || "",
    department: employee?.department || "Helpdesk",
    "Red Flag": employee?.["Red Flag"] || 0,
    Onhold: employee?.Onhold || 0,
    "Assisted Ticket": employee?.["Assisted Ticket"] || 0,
    Late: employee?.Late || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleInputChange = (field: keyof Employee, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-md border-cyan-500/30 text-cyan-50 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-cyan-100">{mode === "add" ? "Add New Employee" : "Edit Employee"}</DialogTitle>
          <DialogDescription className="text-cyan-200">
            {mode === "add"
              ? "Enter the details for the new employee."
              : "Modify the employee's information and statistics."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-cyan-100">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-black/50 border-cyan-500/30 text-cyan-50 focus:border-cyan-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-cyan-100">
                Department
              </Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger className="bg-black/50 border-cyan-500/30 text-cyan-50 focus:border-cyan-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-cyan-500/30">
                  <SelectItem value="Helpdesk" className="text-cyan-50 focus:bg-cyan-500/20">
                    Helpdesk
                  </SelectItem>
                  <SelectItem value="IT Support" className="text-cyan-50 focus:bg-cyan-500/20">
                    IT Support
                  </SelectItem>
                  <SelectItem value="Technical" className="text-cyan-50 focus:bg-cyan-500/20">
                    Technical
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="redFlag" className="text-red-200">
                Red Flag
              </Label>
              <Input
                id="redFlag"
                type="number"
                min="0"
                max="100"
                value={formData["Red Flag"]}
                onChange={(e) => handleInputChange("Red Flag", Number.parseInt(e.target.value) || 0)}
                className="bg-black/50 border-red-500/30 text-cyan-50 focus:border-red-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onhold" className="text-yellow-200">
                Onhold
              </Label>
              <Input
                id="onhold"
                type="number"
                min="0"
                max="100"
                value={formData.Onhold}
                onChange={(e) => handleInputChange("Onhold", Number.parseInt(e.target.value) || 0)}
                className="bg-black/50 border-yellow-500/30 text-cyan-50 focus:border-yellow-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assistedTicket" className="text-green-200">
                Assisted Ticket
              </Label>
              <Input
                id="assistedTicket"
                type="number"
                min="0"
                max="20"
                value={formData["Assisted Ticket"]}
                onChange={(e) => handleInputChange("Assisted Ticket", Number.parseInt(e.target.value) || 0)}
                className="bg-black/50 border-green-500/30 text-cyan-50 focus:border-green-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="late" className="text-blue-200">
                Late
              </Label>
              <Input
                id="late"
                type="number"
                min="0"
                max="100"
                value={formData.Late}
                onChange={(e) => handleInputChange("Late", Number.parseInt(e.target.value) || 0)}
                className="bg-black/50 border-blue-500/30 text-cyan-50 focus:border-blue-400"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {mode === "add" ? "Add Employee" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
