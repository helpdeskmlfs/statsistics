"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Copy, CheckCircle, AlertCircle, FileSpreadsheet, Share } from "lucide-react"

interface SheetSetupGuideProps {
  isConnected: boolean
  error: string | null
}

export default function SheetSetupGuide({ isConnected, error }: SheetSetupGuideProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sampleData = `Name,Department,Red Flag,Onhold,Assisted Ticket,Late
A.R Bayer,Helpdesk,85,92,7,88
J. Querubin,Helpdesk,92,96,5,90
A.L Valente,Helpdesk,78,85,6,75
F. Gabiana,Helpdesk,90,98,4,95
J.P Lobos,Helpdesk,88,90,8,82`

  if (isConnected) return null

  return (
    <Card className="bg-black/40 backdrop-blur-md border-yellow-500/20 shadow-lg shadow-yellow-500/5">
      <CardHeader>
        <CardTitle className="text-yellow-50 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Google Sheet Setup Required
        </CardTitle>
        <CardDescription className="text-yellow-200">
          Your Google Sheet needs to be made public for real-time updates to work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            {error || "Cannot access the Google Sheet. Please make it public using the steps below."}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-cyan-50 flex items-center gap-2">
            <Share className="w-4 h-4" />
            Quick Setup Steps:
          </h4>
          <ol className="space-y-3 text-sm text-cyan-200">
            <li className="flex items-start gap-3 p-3 bg-black/20 rounded border border-cyan-500/20">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">
                1
              </span>
              <div>
                <div className="font-medium text-cyan-100">Open your Google Sheet</div>
                <div className="text-xs text-cyan-300 mt-1">
                  Click the link:
                  https://docs.google.com/spreadsheets/d/1AJoBk_odFcqrY8SMTuiEWf9Q5KcNzcAUyNxgDVelRBg/edit?usp=sharing
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-black/20 rounded border border-cyan-500/20">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">
                2
              </span>
              <div>
                <div className="font-medium text-cyan-100">Click "Share" button</div>
                <div className="text-xs text-cyan-300 mt-1">Located in the top-right corner of Google Sheets</div>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-black/20 rounded border border-cyan-500/20">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">
                3
              </span>
              <div>
                <div className="font-medium text-cyan-100">Change access permissions</div>
                <div className="text-xs text-cyan-300 mt-1">
                  Set to "Anyone with the link" → "Viewer" (read-only access)
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-black/20 rounded border border-cyan-500/20">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">
                4
              </span>
              <div>
                <div className="font-medium text-cyan-100">Add your employee data</div>
                <div className="text-xs text-cyan-300 mt-1">Use the sample data format below</div>
              </div>
            </li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-cyan-50">Required Sheet Structure:</h4>
          <div className="bg-black/30 p-3 rounded border border-cyan-500/20 overflow-x-auto">
            <div className="grid grid-cols-6 gap-2 text-xs min-w-max">
              <div className="font-bold text-cyan-300 p-1 bg-cyan-500/10 rounded">Name</div>
              <div className="font-bold text-cyan-300 p-1 bg-cyan-500/10 rounded">Department</div>
              <div className="font-bold text-red-300 p-1 bg-red-500/10 rounded">Red Flag</div>
              <div className="font-bold text-yellow-300 p-1 bg-yellow-500/10 rounded">Onhold</div>
              <div className="font-bold text-green-300 p-1 bg-green-500/10 rounded">Assisted Ticket</div>
              <div className="font-bold text-blue-300 p-1 bg-blue-500/10 rounded">Late</div>
              <div className="text-cyan-200 p-1">A.R Bayer</div>
              <div className="text-cyan-200 p-1">Helpdesk</div>
              <div className="text-red-200 p-1">85</div>
              <div className="text-yellow-200 p-1">92</div>
              <div className="text-green-200 p-1">7</div>
              <div className="text-blue-200 p-1">88</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              window.open(
                "https://docs.google.com/spreadsheets/d/1AJoBk_odFcqrY8SMTuiEWf9Q5KcNzcAUyNxgDVelRBg/edit?usp=sharing",
                "_blank",
              )
            }
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Open Your Sheet
          </Button>
          <Button
            onClick={() => copyToClipboard(sampleData)}
            size="sm"
            variant="outline"
            className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
          >
            {copied ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? "Copied!" : "Copy Sample Data"}
          </Button>
        </div>

        <div className="text-xs text-cyan-300 bg-cyan-500/5 p-3 rounded border border-cyan-500/20">
          <strong>💡 Pro Tip:</strong> Once your sheet is public, any changes you make will automatically appear in the
          dashboard within 5 seconds!
        </div>
      </CardContent>
    </Card>
  )
}
