import { GoogleGenAI } from "@google/genai";

export async function callGemini(pointers, area) {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  try {
    const prompt = `
    You are an expert solar cost estimation system.

Input Parameters:
- Array of map coordinates: ${JSON.stringify(pointers)}
- Total Area (in square meters): ${area}

Task:
Search out in which location the above coordinates belong to which city or state or country whatever it is.
Based on the provided location and total rooftop area, estimate the approximate cost breakdown for installing a solar panel system suitable for that area.

Important Instructions:
1. Output must be STRICTLY in valid JSON format.
2. Do NOT include explanations, notes, comments, or extra text.
3. Do NOT include markdown formatting.
4. Every value must be a STRING.
5. All monetary values must include currency symbol relevant to the country.
6. Ensure logical cost calculation based on realistic market rates for the specified location.
7. Govt subsidy should reflect applicable schemes in that country/state if available.
8. Overall cost must be sum of all costs before subsidy.
9. Cost after subsidy must subtract govt subsidy from overall cost.
10. Area key below shall have samll description like city and state

The output JSON must contain EXACTLY the following keys:

{
  "area":"",
  "panel cost": "",
  "fabrication/structural cost": "",
  "control unit": "",
  "earthing cost": "",
  "inverter cost": "",
  "installation and labor cost": "",
  "govt subsidy": "",
  "overall cost": "",
  "cost after subsidy": ""
}

Return only valid JSON.`;
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return null;
  }
}
