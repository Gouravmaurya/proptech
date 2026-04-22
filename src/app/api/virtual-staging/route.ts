import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { image, style } = reqBody;

        if (!image || !style) {
            return NextResponse.json({ error: "Missing image or style" }, { status: 400 });
        }

        // Use the specific testing key provided by the user
        const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY1 || "";
        const genAI = new GoogleGenerativeAI(apiKey);

        let base64Data = "";

        if (image.startsWith("http")) {
            // Fetch image from URL
            try {
                const imageRes = await fetch(image);
                if (!imageRes.ok) throw new Error("Failed to fetch image from URL");
                const arrayBuffer = await imageRes.arrayBuffer();
                base64Data = Buffer.from(arrayBuffer).toString("base64");
            } catch (e) {
                console.error("Image Fetch Error:", e);
                return NextResponse.json({ error: "Failed to fetch image from URL" }, { status: 400 });
            }
        } else {
            // Clean base64 string
            base64Data = image.split(",")[1] || image;
        }

        if (!base64Data) {
            return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
        }

        // Step 1: Analyze the room and get a detailed description for the new style
        // We use gemini-2.5-flash (confirmed available)
        const descriptionModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const analysisPrompt = `You are an expert interior designer. 
        I have uploaded an image of a room. 
        Your task is to re-imagine this room in the following style: "${style}".
        
        1. Analyze the functional layout and key architectural features of the room (windows, doors, flooring).
        2. Analyze the CAMERA ANGLE and PERSPECTIVE (e.g., "wide angle shot from corner", "straight on eye-level view", "high angle looking down").
        3. Create a VIVID, detailed visual description of how this SPECIFIC room looks after being renovated in the "${style}" style.
        4. Include details about specific furniture placement (keeping the same layout), lighting, colors, and textures.
        
        Output ONLY a JSON object with this structure:
        {
            "description": "<detailed visual prompt for an image generator including camera angle and perspective keywords>",
            "analysis_text": "<engaging summary for the user>",
            "color_palette": ["#hex", "#hex"]
        }`;

        const analysisResult = await descriptionModel.generateContent([
            analysisPrompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const analysisResponse = await analysisResult.response;
        let analysisText = analysisResponse.text();

        // Clean JSON
        analysisText = analysisText.replace(/```json/g, "").replace(/```/g, "").trim();
        let analysisData;
        try {
            analysisData = JSON.parse(analysisText);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            // Fallback
            analysisData = {
                description: `A beautiful room in ${style} style`,
                analysis_text: analysisText || "Detailed analysis could not be generated.",
                color_palette: []
            };
        }

        // Ensure keys exist even if JSON parse succeeded but structure was wrong
        if (!analysisData.analysis_text) {
            analysisData.analysis_text = analysisText.substring(0, 200) + "..." || "Analysis available in image.";
        }
        if (!analysisData.description) {
            analysisData.description = `A room in ${style} style`;
        }

        // Step 2: Generate the new image using Gemini (Imagen 4.0 Fast)
        let generatedImageBase64 = null;
        let generationError = null;

        try {
            const imagenModel = "imagen-4.0-fast-generate-001"; // High quality, fast model
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${imagenModel}:predict?key=${apiKey}`;

            const payload = {
                instances: [
                    {
                        prompt: `(Masterpiece), (Photorealistic), ${analysisData.description}, ${style} style. Maintain exact room geometry, camera angle, and perspective.`
                    }
                ],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "1:1", // Default to square, or could be 4:3 / 3:4. 
                    // To be safer with user uploads of varying sizes, 1:1 is often a safe default test, 
                    // but for real estate 4:3 is common. Let's stick to 1:1 or 4:3. 
                    // Given we don't know the input aspect ratio easily without analyzing image metadata (which we skipped), 
                    // 1:1 is a safe bet for the model to not distortion too much if it crops.
                }
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Gemini options failed: ${response.status} - ${errorText}`);
                generationError = `Image generation failed: ${response.statusText}`;
            } else {
                const data = await response.json();
                if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
                    generatedImageBase64 = `data:image/jpeg;base64,${data.predictions[0].bytesBase64Encoded}`;
                } else if (data.predictions && data.predictions[0] && data.predictions[0].mimeType && data.predictions[0].bytesBase64Encoded) {
                    // Handle potential alternative structure if API changes, though usually it's bytesBase64Encoded directly
                    generatedImageBase64 = `data:${data.predictions[0].mimeType};base64,${data.predictions[0].bytesBase64Encoded}`;
                } else {
                    console.error("Unexpected Gemini response structure:", JSON.stringify(data).substring(0, 200));
                    generationError = "Image generated but response structure was unexpected.";
                }
            }

        } catch (genError: any) {
            console.error("Image Generation Failed:", genError);
            generationError = "Image generation failed due to an internal error.";
        }

        return NextResponse.json({
            analysis: analysisData.analysis_text || "Analysis generated.",
            description: analysisData.description || style,
            colorPalette: analysisData.color_palette || [],
            stagedImage: generatedImageBase64,
            generationError: generationError
        });
    } catch (error) {
        console.error("Virtual Staging Error:", error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}
