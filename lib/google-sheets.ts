// Enhanced Google Sheets integration service
export interface GoogleSheetsConfig {
  spreadsheetId: string
  sheetName?: string
  apiKey?: string
}

export interface EmployeeSheetData {
  id: number
  name: string
  department: string
  "Red Flag": number
  Onhold: number
  "Assisted Ticket": number
  Late: number
}

// Extract spreadsheet ID from the URL
export function extractSpreadsheetId(url: string): string {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : ""
}

// Convert Google Sheets data to our format
export function transformSheetData(values: any[][]): EmployeeSheetData[] {
  if (!values || values.length < 2) return []

  const data = values.slice(1) // Skip header row

  return data
    .filter((row) => row[0] && String(row[0]).trim() !== "") // Filter out empty rows
    .map((row, index) => ({
      id: index + 1,
      name: String(row[0] || "").trim(),
      department: String(row[1] || "Helpdesk").trim(),
      "Red Flag": Number(row[2]) || 0,
      Onhold: Number(row[3]) || 0,
      "Assisted Ticket": Number(row[4]) || 0,
      Late: Number(row[5]) || 0,
    }))
}

// Multiple methods to fetch data from Google Sheets
export async function fetchGoogleSheetsData(config: GoogleSheetsConfig): Promise<{
  data: EmployeeSheetData[]
  success: boolean
  error?: string
  method?: string
}> {
  const { spreadsheetId, sheetName = "Sheet1" } = config

  // Method 1: CSV Export (most reliable for public sheets)
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0`
    const response = await fetch(csvUrl, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    if (response.ok) {
      const csvText = await response.text()

      if (
        csvText &&
        !csvText.includes("Sorry, the file you have requested does not exist") &&
        !csvText.includes("You need permission") &&
        csvText.trim().length > 0
      ) {
        const rows = csvText
          .split("\n")
          .map((row) => {
            // Handle CSV parsing with proper quote handling
            const cells = []
            let current = ""
            let inQuotes = false

            for (let i = 0; i < row.length; i++) {
              const char = row[i]
              if (char === '"') {
                inQuotes = !inQuotes
              } else if (char === "," && !inQuotes) {
                cells.push(current.trim())
                current = ""
              } else {
                current += char
              }
            }
            cells.push(current.trim())
            return cells
          })
          .filter((row) => row.some((cell) => cell !== ""))

        const data = transformSheetData(rows)
        if (data.length > 0) {
          console.log(`✅ Successfully fetched ${data.length} employees via CSV method`)
          return { data, success: true, method: "CSV" }
        }
      }
    }
  } catch (error) {
    console.log("CSV method failed:", error)
  }

  // Method 2: Google Visualization API
  try {
    const vizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&headers=1&tq=${encodeURIComponent("SELECT *")}`
    const response = await fetch(vizUrl, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    const text = await response.text()

    if (
      text &&
      !text.includes("Sorry, the file you have requested does not exist") &&
      !text.includes("You need permission")
    ) {
      const jsonStart = text.indexOf("{")
      const jsonEnd = text.lastIndexOf("}")

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonText = text.substring(jsonStart, jsonEnd + 1)
        const data = JSON.parse(jsonText)

        if (data.table && data.table.rows && data.table.rows.length > 0) {
          const headers = ["Name", "Department", "Red Flag", "Onhold", "Assisted Ticket", "Late"]
          const rows = data.table.rows.map((row: any) => row.c.map((cell: any) => (cell ? cell.v || "" : "")))
          const formattedData = [headers, ...rows]
          const transformedData = transformSheetData(formattedData)

          if (transformedData.length > 0) {
            console.log(`✅ Successfully fetched ${transformedData.length} employees via Visualization API`)
            return { data: transformedData, success: true, method: "Visualization API" }
          }
        }
      }
    }
  } catch (error) {
    console.log("Visualization API method failed:", error)
  }

  // Method 3: Try alternative CSV format
  try {
    const altCsvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&id=${spreadsheetId}&gid=0`
    const response = await fetch(altCsvUrl)

    if (response.ok) {
      const csvText = await response.text()
      if (csvText && csvText.trim().length > 0) {
        const rows = csvText.split("\n").map((row) => row.split(",").map((cell) => cell.replace(/"/g, "").trim()))
        const data = transformSheetData(rows)
        if (data.length > 0) {
          console.log(`✅ Successfully fetched ${data.length} employees via Alternative CSV`)
          return { data, success: true, method: "Alternative CSV" }
        }
      }
    }
  } catch (error) {
    console.log("Alternative CSV method failed:", error)
  }

  // Return error if all methods failed
  return {
    data: [],
    success: false,
    error: "Unable to access Google Sheet. Please ensure the sheet is public and contains data.",
  }
}

// Sample data for fallback
export function getSampleData(): EmployeeSheetData[] {
  return [
    {
      id: 1,
      name: "A.R Bayer",
      department: "Helpdesk",
      "Red Flag": 85,
      Onhold: 92,
      "Assisted Ticket": 7,
      Late: 88,
    },
    {
      id: 2,
      name: "J. Querubin",
      department: "Helpdesk",
      "Red Flag": 92,
      Onhold: 96,
      "Assisted Ticket": 5,
      Late: 90,
    },
    {
      id: 3,
      name: "A.L Valente",
      department: "Helpdesk",
      "Red Flag": 78,
      Onhold: 85,
      "Assisted Ticket": 6,
      Late: 75,
    },
    {
      id: 4,
      name: "F. Gabiana",
      department: "Helpdesk",
      "Red Flag": 90,
      Onhold: 98,
      "Assisted Ticket": 4,
      Late: 95,
    },
    {
      id: 5,
      name: "J.P Lobos",
      department: "Helpdesk",
      "Red Flag": 88,
      Onhold: 90,
      "Assisted Ticket": 8,
      Late: 82,
    },
  ]
}
