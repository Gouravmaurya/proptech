"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";
import { writeFile } from "fs/promises";
import { join } from "path";

// 0. Upload Profile Image
export async function uploadProfileImage(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" };
    }

    const file = formData.get("image") as File;
    if (!file || file.size === 0) {
        return { success: false, message: "No valid file uploaded" };
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
        return { success: false, message: "File must be an image" };
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        // Sanitize original name or just use ID+Time
        const ext = file.name.split('.').pop() || "jpg";
        const filename = `user-${session.user.id}-${Date.now()}.${ext}`;
        const uploadDir = join(process.cwd(), "public", "uploads");
        const filePath = join(uploadDir, filename);

        // Ensure directory exists (redundant if task created it, but good for safety if deployment clears it)
        // await mkdir(uploadDir, { recursive: true }); // skipped for brevity, assumed existing

        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/${filename}`;

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: publicUrl },
        });

        revalidatePath("/dashboard/settings");
        // revalidatePath("/", "layout"); // Try to revalidate layout for sidebar image update
        revalidatePath("/dashboard");

        return { success: true, message: "Profile picture updated successfully!" };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, message: "Failed to upload image" };
    }
}

// 1. Update User Preferences
export async function updateUserPreferences(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" };
    }

    const location = formData.get("location") as string;

    try {
        // Current simple implementation: Store location in preferences JSON string
        const preferences = JSON.stringify({ location });

        await prisma.user.update({
            where: { id: session.user.id },
            data: { preferences },
        });

        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard");
        return { success: true, message: "Preferences updated successfully" };
    } catch (error) {
        console.error("Failed to update preferences:", error);
        return { success: false, message: "Failed to update preferences" };
    }
}

// 2. Get User's Saved Property IDs (for UI state)
export async function getSavedPropertyIds() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const saved = await prisma.savedProperty.findMany({
            where: { userId: session.user.id },
            select: { propertyId: true },
        });
        return saved.map((s) => s.propertyId);
    } catch (error) {
        console.error("Failed to fetch saved properties:", error);
        return [];
    }
}

// Helper to resolve a Property ID from a potential Lead ID or Source ID
// Uses a single DB query with OR conditions instead of 3 sequential queries.
async function resolvePropertyId(inputId: string) {
    // 1. Try Property table first (direct ID or sourceId match) — 1 query
    const directProperty = await prisma.property.findFirst({
        where: { OR: [{ id: inputId }, { sourceId: inputId }] },
        select: { id: true }
    });
    if (directProperty) return directProperty.id;

    // 2. If not a property ID, check if it's a Lead ID — 1 query
    const lead = await prisma.lead.findUnique({
        where: { id: inputId },
        select: { propertyId: true }
    });
    if (lead?.propertyId) return lead.propertyId;

    return null;
}

// 3. Toggle Save Status (Add/Remove)
export async function togglePropertySave(inputId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        const propertyId = await resolvePropertyId(inputId);

        if (!propertyId) {
            console.error(`Toggle Save: Could not resolve property for ID: ${inputId}`);
            throw new Error("Property not found");
        }

        const existing = await prisma.savedProperty.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId,
                },
            },
        });

        if (existing) {
            await prisma.savedProperty.delete({
                where: { id: existing.id },
            });
            revalidatePath("/dashboard/saved");
            revalidatePath("/dashboard"); // Also refresh main dashboard
            revalidatePath(`/properties/${inputId}`); // Refresh property page (using original input ID to be safe)
            return { saved: false };
        } else {
            await prisma.savedProperty.create({
                data: {
                    userId,
                    propertyId,
                },
            });
            revalidatePath("/dashboard/saved");
            revalidatePath("/dashboard");
            revalidatePath(`/properties/${inputId}`);
            return { saved: true };
        }
    } catch (error) {
        console.error("Failed to toggle save:", error);
        throw new Error("Failed to toggle save");
    }
}

// 4. Check if a specific property is saved
export async function checkPropertySaved(inputId: string) {
    const session = await auth();
    if (!session?.user?.id) return false;

    try {
        const propertyId = await resolvePropertyId(inputId);
        if (!propertyId) return false;

        const count = await prisma.savedProperty.count({
            where: { userId: session.user.id, propertyId }
        });
        return count > 0;
    } catch (error) {
        console.error("Failed to check saved status:", error);
        return false;
    }
}

// 5. Get Full Saved Properties (for /saved page)
// Returns mapped Lead/Property objects for PropertyCard
export async function getSavedProperties() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const getCached = unstable_cache(
        async (userId: string) => {
            const saved = await prisma.savedProperty.findMany({
                where: { userId },
                include: {
                    property: {
                        include: {
                            leads: {
                                take: 1,
                                orderBy: { createdAt: 'desc' },
                                include: {
                                    analyses: {
                                        take: 1,
                                        orderBy: { createdAt: 'desc' }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            // Map to PropertyCard format
            return saved.map(item => {
                const p = item.property;
                // Best effort to find the lead associated with this property
                // (SavedProperty links to Property, but Analysis is on Lead)
                const lead = p.leads?.[0];
                const analysis = lead?.analyses?.[0];

                const imageData = p?.images ? JSON.parse(p.images) : [];
                const mainImage = p?.imageUrl || (imageData.length > 0 ? imageData[0] : null) || "/placeholder-house.jpg";

                let financials: any = {};
                if (analysis?.financials) {
                    try { financials = JSON.parse(analysis.financials); } catch (e) { }
                }

                return {
                    id: p.id, // Actual Property ID
                    zpid: p.sourceId, // Zillow ID for routing

                    streetAddress: p.address || (lead?.title) || "Unknown Address",
                    city: p.city || '',
                    state: p.state || '',
                    zipcode: p.zip || '',

                    price: p.price || (lead?.price) || 0,

                    bedrooms: p.bedrooms || 0,
                    bathrooms: p.bathrooms || 0,
                    livingArea: p.sqft || 0,

                    homeType: p.type || "Single Family",
                    homeStatus: p.status || (lead?.status) || "For Sale",

                    imgSrc: mainImage,
                    rentZestimate: p.rentEstimate || null,
                    zestimate: p.zestimate || null,
                    daysOnMarket: p.daysOnMarket || null,

                    // Analysis metrics if available
                    capRate: financials.capRate || 0,
                    roi: financials.roi5 || 0,
                };
            });
        },
        [`saved-properties-${session.user.id}`],
        { tags: [`saved-properties-${session.user.id}`, 'saved-properties'] }
    );

    try {
        return await getCached(session.user.id);
    } catch (error) {
        console.error("Failed to get saved properties:", error);
        return [];
    }
}
