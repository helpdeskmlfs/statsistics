"use client"

import { employeeData } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

export function EmployeeTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Red Flag</TableHead>
            <TableHead>Onhold</TableHead>
            <TableHead>Assisted Ticket</TableHead>
            <TableHead>Late</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeData.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={employee["Red Flag"]} className="h-2 w-[60px]" />
                  <span className="text-sm">{employee["Red Flag"]}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={employee.Onhold} className="h-2 w-[60px]" />
                  <span className="text-sm">{employee.Onhold}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={employee["Assisted Ticket"] * 10} className="h-2 w-[60px]" />
                  <span className="text-sm">{employee["Assisted Ticket"]}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={employee.Late} className="h-2 w-[60px]" />
                  <span className="text-sm">{employee.Late}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
