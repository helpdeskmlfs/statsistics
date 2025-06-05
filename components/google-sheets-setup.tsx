"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle, ExternalLink, Code, Database, Webhook } from "lucide-react"
import { generateAppsScriptCode } from "@/lib/google-sheets-writer"

export default function GoogleSheetsSetup() {
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const appsScriptCode = generateAppsScriptCode()

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20 shadow-lg shadow-cyan-500/5">
      <CardHeader>
        <CardTitle className="text-cyan-50 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Google Sheets Write Integration Setup
        </CardTitle>
        <CardDescription className="text-cyan-200">
          Set up automatic writing to your Google Sheet when adding/editing employees
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <Webhook className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            <strong>Note:</strong> Direct writing to Google Sheets requires a backend service or Google Apps Script for
            security reasons.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-cyan-50 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Setup Instructions:
          </h4>

          <ol className="space-y-3 text-sm text-cyan-200">
            <li className="flex items-start gap-3 p-3 bg-black/20 rounded border border-cyan-500/20">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">
                1
              </span>
              <div>
                <div className="font-medium text-cyan-100">Open Google Apps Script</div>
                <div className="text-xs text-cyan-300 mt-1">
                  Go to{" "}
                  <a
                    href="https://script.google.com"
                    target="_blank"
                    className="text-cyan-400 hover:underline"
                    rel="noreferrer"
                  >
                    script.google.com
                  </a>{" "}
                  and create a new project
                </div>
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 bg-black/20 rounded border border-cyan-500/20">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">
                2
              </span>
              <div>
                <div className="font-medium text-cyan-100">Copy the webhook code</div>
                <div className="text-xs text-cyan-300 mt-1">
                  Use the code below to create a webhook that can receive data from the dashboard
                </div>
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 bg-black/20 rounded border border-cyan-500/20">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">
                3
              </span>
              <div>
                <div className="font-medium text-cyan-100">Deploy as Web App</div>
                <div className="text-xs text-cyan-300 mt-1">
                  Deploy → New Deployment → Type: Web app → Execute as: Me → Access: Anyone
                </div>
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 bg-black/20 rounded border border-cyan-500/20">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">
                4
              </span>
              <div>
                <div className="font-medium text-cyan-100">Update the frontend</div>
                <div className="text-xs text-cyan-300 mt-1">
                  Replace the demo writeToGoogleSheets function with your webhook URL
                </div>
              </div>
            </li>
          </ol>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-cyan-50">Google Apps Script Code:</h4>
            <Button
              onClick={() => setShowCode(!showCode)}
              size="sm"
              variant="outline"
              className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
            >
              {showCode ? "Hide Code" : "Show Code"}
            </Button>
          </div>

          {showCode && (
            <div className="bg-black/30 p-3 rounded border border-cyan-500/20 overflow-x-auto">
              <pre className="text-xs text-cyan-200 whitespace-pre-wrap">{appsScriptCode}</pre>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => copyToClipboard(appsScriptCode)}
            size="sm"
            variant="outline"
            className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
          >
            {copied ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? "Copied!" : "Copy Apps Script Code"}
          </Button>

          <Button
            onClick={() => window.open("https://script.google.com", "_blank")}
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Open Apps Script
          </Button>
        </div>

        <div className="text-xs text-cyan-300 bg-cyan-500/5 p-3 rounded border border-cyan-500/20">
          <strong>💡 Current Status:</strong> The Add/Edit Employee feature is working with simulated Google Sheets
          integration. Follow the setup above to enable real Google Sheets writing.
        </div>
      </CardContent>
    </Card>
  )
}
