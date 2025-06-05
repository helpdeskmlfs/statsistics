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
import { AlertCircle, Lock } from "lucide-react"

interface PermissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function PermissionModal({ isOpen, onClose, onSuccess }: PermissionModalProps) {
  const [permissionCode, setPermissionCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const REQUIRED_CODE = "20237859"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate a brief loading time for security feel
    setTimeout(() => {
      if (permissionCode === REQUIRED_CODE) {
        setPermissionCode("")
        setError("")
        onSuccess()
        onClose()
      } else {
        setError("Invalid permission code. Access denied.")
        setPermissionCode("")
      }
      setIsLoading(false)
    }, 500)
  }

  const handleClose = () => {
    setPermissionCode("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/90 backdrop-blur-md border-cyan-500/30 text-cyan-50 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-cyan-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-yellow-400" />
            Permission Required
          </DialogTitle>
          <DialogDescription className="text-cyan-200">
            Enter the permission code to access employee management functions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="permissionCode" className="text-cyan-100">
              Permission Code
            </Label>
            <Input
              id="permissionCode"
              type="password"
              value={permissionCode}
              onChange={(e) => setPermissionCode(e.target.value)}
              className="bg-black/50 border-cyan-500/30 text-cyan-50 focus:border-cyan-400"
              placeholder="Enter permission code"
              required
              disabled={isLoading}
            />
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
