// Google Sheets Writer Service
export interface EmployeeWriteData {
  name: string
  department: string
  redFlag: number
  onhold: number
  assistedTicket: number
  late: number
}

export interface WriteResponse {
  success: boolean
  message: string
  error?: string
}

// Function to write to Google Sheets
export async function writeToGoogleSheets(
  action: "add" | "edit" | "delete",
  employeeData: EmployeeWriteData,
  employeeId?: number,
): Promise<WriteResponse> {
  // The spreadsheet ID from the URL
  const spreadsheetId = "1AJoBk_odFcqrY8SMTuiEWf9Q5KcNzcAUyNxgDVelRBg"

  try {
    // For demonstration purposes, we'll log what would be sent to Google Sheets
    console.log(`📝 Writing to Google Sheet (${action}):`, employeeData)

    // In a real implementation, you would use one of these approaches:

    // APPROACH 1: Using a backend API endpoint
    // const response = await fetch('/api/google-sheets', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ action, data: employeeData, spreadsheetId })
    // });
    // const result = await response.json();
    // return result;

    // APPROACH 2: Using Google Apps Script Web App as an API
    // const scriptUrl = 'https://script.google.com/macros/s/AKfycbwJTBEH7WbCP03s32pli4R-C-WLl_bbRKOJdTWffbA27co1F_d56A8H-YCO2B854vJh/exec'; // Your deployed script URL
    // const response = await fetch(scriptUrl, {
    //   method: 'POST',
    //   body: JSON.stringify({ action, data: employeeData, spreadsheetId })
    // });
    // const result = await response.json();
    // return result;

    // For now, we'll simulate a successful response
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network delay

    return {
      success: true,
      message: `Employee ${action === "add" ? "added to" : action === "edit" ? "updated in" : "deleted from"} Google Sheets successfully`,
    }
  } catch (error) {
    console.error("Error writing to Google Sheets:", error)
    return {
      success: false,
      message: "Failed to update Google Sheets",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Format employee data for Google Sheets
export function formatEmployeeForSheets(employee: any): EmployeeWriteData {
  return {
    name: employee.name || "",
    department: employee.department || "Helpdesk",
    redFlag: employee["Red Flag"] || 0,
    onhold: employee.Onhold || 0,
    assistedTicket: employee["Assisted Ticket"] || 0,
    late: employee.Late || 0,
  }
}

// Generate Google Apps Script code for webhook
export function generateAppsScriptCode(spreadsheetId: string): string {
  return `
// Google Apps Script Webhook for Employee Dashboard
// 1. Copy this entire code to script.google.com
// 2. Replace the spreadsheetId if needed (currently set to your sheet)
// 3. Deploy as web app (Deploy > New deployment > Web app)
// 4. Set "Execute as" to "Me" and "Who has access" to "Anyone"
// 5. Copy the web app URL and use it in your frontend

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet - using your spreadsheet ID
    const sheet = SpreadsheetApp.openById('${spreadsheetId}').getActiveSheet();
    
    // Handle different actions
    if (data.action === 'add') {
      // Add new row to the sheet
      sheet.appendRow([
        data.data.name,
        data.data.department,
        data.data.redFlag,
        data.data.onhold,
        data.data.assistedTicket,
        data.data.late
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Employee added successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    } 
    else if (data.action === 'edit') {
      // Find and update existing row
      const values = sheet.getDataRange().getValues();
      for (let i = 1; i < values.length; i++) {
        if (values[i][0] === data.data.name) {
          sheet.getRange(i + 1, 1, 1, 6).setValues([[
            data.data.name,
            data.data.department,
            data.data.redFlag,
            data.data.onhold,
            data.data.assistedTicket,
            data.data.late
          ]]);
          
          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            message: 'Employee updated successfully'
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Employee not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    else if (data.action === 'delete') {
      // Find and delete row
      const values = sheet.getDataRange().getValues();
      for (let i = 1; i < values.length; i++) {
        if (values[i][0] === data.data.name) {
          sheet.deleteRow(i + 1);
          
          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            message: 'Employee deleted successfully'
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Employee not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// This function handles GET requests for testing
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script webhook is working!'
  })).setMimeType(ContentService.MimeType.JSON);
}
`
}
