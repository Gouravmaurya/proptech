"use server";

import fs from "fs";
import path from "path";

export async function contact(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const inquiryType = formData.get("inquiryType") as string;
    const message = formData.get("message") as string;

    if (!email || !email.includes("@")) {
        return { success: false, error: "Please enter a valid email address." };
    }

    try {
        const dataDir = path.join(process.cwd(), "data");
        const filePath = path.join(dataDir, "contacts.csv");

        // Ensure directory exists
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        // Header if file doesn't exist
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "FirstName,LastName,Email,InquiryType,Message,Timestamp\n", "utf8");
        }

        // Sanitize message and other fields for CSV (remove newlines and commas)
        const sanitize = (text: string) => (text || "").replace(/[\n\r,]/g, " ");
        
        const row = [
            sanitize(firstName),
            sanitize(lastName),
            sanitize(email),
            sanitize(inquiryType),
            sanitize(message),
            new Date().toISOString()
        ].join(",") + "\n";

        fs.appendFileSync(filePath, row, "utf8");

        return { success: true };
    } catch (error) {
        console.error("Contact form error:", error);
        return { success: false, error: "Something went wrong. Please try again later." };
    }
}
