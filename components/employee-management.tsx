"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Shield } from "lucide-react"
import EmployeeFormModal from "./employee-form-modal"
import PermissionModal from "./permission-modal"
import { employeeData as initialData } from "@/lib/data"
import { writeToGoogleSheets, formatEmployeeForSheets } from "@/lib/google-sheets-writer"
import { useToast } from "@/hooks/use-toast"

interface Employee {
  id: number
  name: string
  department: string
  "Red Flag": number
  Onhold: number
  "Assisted Ticket": number
  Late: number
}

interface EmployeeManagementProps {
  onDataChange: (data: Employee[]) => void
}

export default function EmployeeManagement({ onDataChange }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [hasPermission, setHasPermission] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  const handleAddEmployee = () => {
    if (!hasPermission) {
      setIsPermissionModalOpen(true)
      return
    }

    setEditingEmployee(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handlePermissionSuccess = () => {
    setHasPermission(true)
    // Automatically open the add employee modal after permission is granted
    setEditingEmployee(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    if (!hasPermission) {
      setIsPermissionModalOpen(true)
      return
    }

    setEditingEmployee(employee)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleDeleteEmployee = async (id: number) => {
    if (!hasPermission) {
      setIsPermissionModalOpen(true)
      return
    }

    const employeeToDelete = employees.find((emp) => emp.id === id)
    if (!employeeToDelete) return

    setIsSyncing(true)

    try {
      // Write to Google Sheets
      const result = await writeToGoogleSheets("delete", formatEmployeeForSheets(employeeToDelete), id)

      if (result.success) {
        const updatedEmployees = employees.filter((emp) => emp.id !== id)
        setEmployees(updatedEmployees)
        onDataChange(updatedEmployees)

        toast({
          title: "Employee Deleted",
          description: "Employee removed from dashboard and Google Sheets",
          variant: "default",
        })
      } else {
        toast({
          title: "Sync Error",
          description: result.error || "Failed to update Google Sheets",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSaveEmployee = async (employee: Employee) => {
    setIsSyncing(true)

    try {
      let updatedEmployees: Employee[]
      const action = modalMode === "add" ? "add" : "edit"

      if (modalMode === "add") {
        const newEmployee = { ...employee, id: Date.now() }
        updatedEmployees = [...employees, newEmployee]
      } else {
        updatedEmployees = employees.map((emp) => (emp.id === employee.id ? employee : emp))
      }

      // Write to Google Sheets
      const result = await writeToGoogleSheets(action, formatEmployeeForSheets(employee), employee.id)

      if (result.success) {
        setEmployees(updatedEmployees)
        onDataChange(updatedEmployees)

        toast({
          title: `Employee ${action === "add" ? "Added" : "Updated"}`,
          description: `Changes synced to Google Sheets successfully`,
          variant: "default",
        })
      } else {
        // Still update locally but show warning
        setEmployees(updatedEmployees)
        onDataChange(updatedEmployees)

        toast({
          title: "Partial Success",
          description: "Updated locally but failed to sync to Google Sheets",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save employee data",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
      setIsModalOpen(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button
        onClick={handleAddEmployee}
        className="bg-cyan-600 hover:bg-cyan-700 text-white"
        size="sm"
        disabled={isSyncing}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Employee
      </Button>

      {hasPermission && (
        <div className="flex items-center text-xs text-green-400">
          <Shield className="w-3 h-3 mr-1" />
          Authorized
        </div>
      )}

      {isSyncing && (
        <div className="flex items-center text-xs text-cyan-400">
          <div className="w-3 h-3 mr-1 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          Syncing to Sheets...
        </div>
      )}

      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        onSuccess={handlePermissionSuccess}
      />

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
        mode={modalMode}
      />
    </div>
  )
}
