import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to the .env file
const envFilePath = path.join(process.cwd(), ".env");

// Function to read the .env file
function readEnvFile() {
  try {
    const content = fs.readFileSync(envFilePath, "utf8");
    const envVars = {};
    const sections = [];
    let currentSection = { name: "", vars: [] };

    // Parse the content line by line
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Check if it's a comment/section header
      if (trimmedLine.startsWith("#")) {
        // If we already have variables in the current section, push it and start a new one
        if (currentSection.vars.length > 0) {
          sections.push({ ...currentSection });
          currentSection = { name: trimmedLine.substring(1).trim(), vars: [] };
        } else {
          currentSection.name = trimmedLine.substring(1).trim();
        }
      } 
      // Check if it's a variable
      else if (trimmedLine.includes("=")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        const value = valueParts.join("="); // Handle values that might contain = characters
        
        envVars[key] = value;
        currentSection.vars.push({
          key,
          value,
          line: lines.indexOf(line)
        });
      }
    }
    
    // Add the last section if it has variables
    if (currentSection.vars.length > 0) {
      sections.push(currentSection);
    }

    return { envVars, sections, content };
  } catch (error) {
    console.error("Error reading .env file:", error);
    return { envVars: {}, sections: [], content: "" };
  }
}

// Function to write to the .env file
function writeEnvFile(updates) {
  try {
    const { content } = readEnvFile();
    const lines = content.split("\n");
    
    // Apply updates
    for (const [key, value] of Object.entries(updates)) {
      const existingLineIndex = lines.findIndex(line => {
        return line.trim().startsWith(`${key}=`);
      });
      
      if (existingLineIndex !== -1) {
        // Update existing line
        lines[existingLineIndex] = `${key}=${value}`;
      } else {
        // Add new line at the end
        lines.push(`${key}=${value}`);
      }
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(envFilePath, lines.join("\n"));
    return true;
  } catch (error) {
    console.error("Error writing to .env file:", error);
    return false;
  }
}

// GET handler to read environment variables
export async function GET() {
  try {
    const { sections } = readEnvFile();
    return NextResponse.json({ success: true, sections });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST handler to update environment variables
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { updates } = data;
    
    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid updates format" },
        { status: 400 }
      );
    }
    
    const success = writeEnvFile(updates);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to update environment variables" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
