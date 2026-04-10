import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateUI(prompt) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create a detailed prompt for the AI
    const fullPrompt = `You are an expert React UI developer. Create a complete React component with Tailwind CSS for: "${prompt}"

IMPORTANT RULES:
1. Return ONLY the React component code - no explanations
2. Use functional component with proper export default
3. Use Tailwind CSS for ALL styling
4. Make it responsive, modern, and beautiful
5. Add hover effects and smooth transitions
6. Include proper spacing and colors

Example format:
import React from 'react';

export default function ComponentName() {
  return (
    <div className="container mx-auto p-4">
      {/* Your UI elements here */}
    </div>
  );
}

Generate a React component for: ${prompt}`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let code = response.text();
    
    // Clean up the response
    code = code.replace(/```jsx\n?/g, '');
    code = code.replace(/```javascript\n?/g, '');
    code = code.replace(/```\n?/g, '');
    code = code.trim();
    
    // Ensure React is imported
    if (!code.includes('import React')) {
      code = `import React from 'react';\n\n${code}`;
    }
    
    // Ensure export default exists
    if (!code.includes('export default')) {
      const functionMatch = code.match(/function\s+(\w+)/);
      if (functionMatch) {
        code += `\n\nexport default ${functionMatch[1]};`;
      }
    }
    
    return code;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate UI. Please check your API key.');
  }
}
