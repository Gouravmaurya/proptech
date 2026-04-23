"use server";

import fs from "fs";
import path from "path";

export async function subscribe(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
        return { success: false, error: "Please enter a valid email address." };
    }

    try {
        const dataDir = path.join(process.cwd(), "data");
        const filePath = path.join(dataDir, "subscribers.csv");

        // Ensure directory exists
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        // Header if file doesn't exist
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "Email,Timestamp\n", "utf8");
        }

        // Append email and timestamp
        const timestamp = new Date().toISOString();
        const row = `${email},${timestamp}\n`;
        fs.appendFileSync(filePath, row, "utf8");

        return { success: true };
    } catch (error) {
        console.error("Subscription error:", error);
        return { success: false, error: "Something went wrong. Please try again later." };
    }
}
