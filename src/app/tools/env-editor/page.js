"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function EnvEditorPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editedValues, setEditedValues] = useState({});

  // Fetch environment variables on component mount
  useEffect(() => {
    fetchEnvVars();
  }, []);

  // Function to fetch environment variables
  const fetchEnvVars = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("/api/env");
      const data = await response.json();
      
      if (data.success) {
        setSections(data.sections);
        // Initialize editedValues with current values
        const initialValues = {};
        data.sections.forEach(section => {
          section.vars.forEach(variable => {
            initialValues[variable.key] = variable.value;
          });
        });
        setEditedValues(initialValues);
      } else {
        setError(data.error || "Failed to load environment variables");
      }
    } catch (err) {
      setError("Error loading environment variables: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (key, value) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      
      // Find which values have changed
      const updates = {};
      sections.forEach(section => {
        section.vars.forEach(variable => {
          const currentValue = editedValues[variable.key];
          if (currentValue !== variable.value) {
            updates[variable.key] = currentValue;
          }
        });
      });
      
      // If nothing changed, don't make the API call
      if (Object.keys(updates).length === 0) {
        setSuccess("No changes to save");
        setSaving(false);
        return;
      }
      
      const response = await fetch("/api/env", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ updates })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Environment variables updated successfully");
        // Refresh the variables
        fetchEnvVars();
      } else {
        setError(data.error || "Failed to update environment variables");
      }
    } catch (err) {
      setError("Error saving environment variables: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">环境变量编辑器</h1>
        <Link href="/tools" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
          返回工具箱
        </Link>
      </div>
      
      <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <p className="text-gray-400">编辑应用程序的环境变量。这些变量用于配置各种API和服务。</p>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>加载环境变量...</p>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-900 bg-opacity-50 text-red-200 p-4 rounded-md">
              {error}
            </div>
          </div>
        ) : (
          <div className="p-6">
            {success && (
              <div className="bg-green-900 bg-opacity-50 text-green-200 p-4 rounded-md mb-6">
                {success}
              </div>
            )}
            
            <div className="space-y-8">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-700 rounded-md overflow-hidden">
                  <div className="bg-gray-800 p-4 font-medium">
                    {section.name || "General Settings"}
                  </div>
                  <div className="p-4 space-y-4">
                    {section.vars.map((variable, varIndex) => (
                      <div key={varIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="font-mono text-sm text-gray-300">
                          {variable.key}
                        </div>
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={editedValues[variable.key] || ""}
                            onChange={(e) => handleInputChange(variable.key, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded-md text-white font-medium ${saving ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {saving ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    保存中...
                  </>
                ) : "保存更改"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
