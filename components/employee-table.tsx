"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import EmployeeFormModal from "./employee-form-modal"
import PermissionModal from "./permission-modal"

interface Employee {
  id: number
  name: string
  department: string
  "Red Flag": number
  Onhold: number
  "Assisted Ticket": number
  Late: number
}

interface EmployeeTableProps {
  data?: Employee[]
  onDataChange?: (data: Employee[]) => void
}

export default function EmployeeTable({ data, onDataChange }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>(data || [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: "edit" | "delete"; employee: Employee } | null>(null)

  useEffect(() => {
    if (data) {
      setEmployees(data)
    }
  }, [data])

  const handleEditEmployee = (employee: Employee) => {
    if (!hasPermission) {
      setPendingAction({ type: "edit", employee })
      setIsPermissionModalOpen(true)
      return
    }

    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  const handleDeleteEmployee = (employee: Employee) => {
    if (!hasPermission) {
      setPendingAction({ type: "delete", employee })
      setIsPermissionModalOpen(true)
      return
    }

    const updatedEmployees = employees.filter((emp) => emp.id !== employee.id)
    setEmployees(updatedEmployees)
    onDataChange?.(updatedEmployees)
  }

  const handlePermissionSuccess = () => {
    setHasPermission(true)

    if (pendingAction) {
      if (pendingAction.type === "edit") {
        setEditingEmployee(pendingAction.employee)
        setIsModalOpen(true)
      } else if (pendingAction.type === "delete") {
        const updatedEmployees = employees.filter((emp) => emp.id !== pendingAction.employee.id)
        setEmployees(updatedEmployees)
        onDataChange?.(updatedEmployees)
      }
      setPendingAction(null)
    }
  }

  const handleSaveEmployee = (employee: Employee) => {
    const updatedEmployees = employees.map((emp) => (emp.id === employee.id ? employee : emp))
    setEmployees(updatedEmployees)
    onDataChange?.(updatedEmployees)
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-cyan-500/20 hover:bg-cyan-500/5">
            <TableHead className="text-cyan-50 font-semibold">Name</TableHead>
            <TableHead className="text-red-200 font-semibold">Red Flag</TableHead>
            <TableHead className="text-yellow-200 font-semibold">Onhold</TableHead>
            <TableHead className="text-green-200 font-semibold">Assisted Ticket</TableHead>
            <TableHead className="text-cyan-50 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
              <TableCell className="font-medium text-cyan-50">{employee.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={employee["Red Flag"]}
                    className="h-2 w-[60px] bg-red-900/30"
                    style={
                      {
                        "--progress-background": "rgb(127 29 29 / 0.3)",
                        "--progress-foreground": "#dc2626",
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-sm text-red-200 font-medium">{employee["Red Flag"]}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={employee["Onhold"]}
                    className="h-2 w-[60px] bg-yellow-900/30"
                    style={
                      {
                        "--progress-background": "rgb(113 63 18 / 0.3)",
                        "--progress-foreground": "#eab308",
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-sm text-yellow-200 font-medium">{employee["Onhold"]}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={employee["Assisted Ticket"] * 10}
                    className="h-2 w-[60px] bg-green-900/30"
                    style={
                      {
                        "--progress-background": "rgb(20 83 45 / 0.3)",
                        "--progress-foreground": "#00ff00",
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-sm text-green-200 font-medium">{employee["Assisted Ticket"]}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEmployee(employee)}
                    className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEmployee(employee)}
                    className="border-red-500/30 text-red-100 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => {
          setIsPermissionModalOpen(false)
          setPendingAction(null)
        }}
        onSuccess={handlePermissionSuccess}
      />

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
        mode="edit"
      />
    </div>
  )
}
