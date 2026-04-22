import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const properties = [
        {
            title: "Modern Loft in Downtown",
            sourceId: "SEED-001",
            address: "123 Innovation Dr, Austin, TX",
            price: 450000,
            sqft: 1200,
            roi: 8.5,
            capRate: 6.2,
            imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop",
            bedrooms: 2,
            bathrooms: 2,
            yearBuilt: 2019,
            description: "A stunning modern loft with high ceilings and smart home integration."
        },
        {
            title: "Suburban Family Home",
            sourceId: "SEED-002",
            address: "456 Oak Lane, Dallas, TX",
            price: 650000,
            sqft: 2400,
            roi: 6.8,
            capRate: 5.5,
            imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop",
            bedrooms: 4,
            bathrooms: 3,
            yearBuilt: 2015,
            description: "Spacious family home with a large backyard and excellent school district."
        },
        {
            title: "Investment Condo",
            sourceId: "SEED-003",
            address: "789 Tech Blvd, Seattle, WA",
            price: 320000,
            sqft: 850,
            roi: 9.2,
            capRate: 7.0,
            imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop",
            bedrooms: 1,
            bathrooms: 1,
            yearBuilt: 2021,
            description: "Perfect for rental income, located near major tech hubs."
        }
    ]

    for (const p of properties) {
        await prisma.property.create({
            data: p
        })
    }

    console.log('Seed data inserted successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
