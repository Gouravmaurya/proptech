export interface PriceEvent {
    date: string;
    event: string;
    price: number;
    pricePerSqft?: number;
}

export interface TaxRecord {
    year: number;
    taxPaid: number;
    taxAssessment: number;
}

export interface School {
    name: string;
    rating: number | string;
    distance: number;
    grades: string;
    type?: string;
}

export function parsePriceHistory(rawData: string | any): PriceEvent[] {
    try {
        const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
        if (!data) return [];

        // Zillow / ZHomes common price history field
        const history = data.priceHistory || data.price_history || [];
        
        return history.map((item: any) => ({
            date: item.date || item.time || '',
            event: item.event || 'Price Change',
            price: item.price || 0,
            pricePerSqft: item.pricePerSquareFoot || item.pricePerSqft
        }));
    } catch (e) {
        console.error("Error parsing price history:", e);
        return [];
    }
}

export function parseTaxHistory(rawData: string | any): TaxRecord[] {
    try {
        const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
        if (!data) return [];

        // Support taxHistory from Real-Time RE Data API and ZHomes
        const taxes = data.taxHistory || data.tax_history || [];

        return taxes.map((item: any) => ({
            // Real-Time RE API uses 'time' (timestamp ms) or direct 'year'
            year: item.year
                ? Number(item.year)
                : (item.time ? new Date(Number(item.time)).getFullYear() : 0),
            // Real-Time RE API uses 'taxPaid'; ZHomes may use 'amount'
            taxPaid: item.taxPaid ?? item.amount ?? 0,
            // Real-Time RE API uses 'value' for assessed value
            taxAssessment: item.value ?? item.taxAssessment ?? 0,
        })).filter((r: TaxRecord) => r.year > 0);
    } catch (e) {
        console.error("Error parsing tax history:", e);
        return [];
    }
}

export function parseSchools(rawData: string | any): School[] {
    try {
        const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
        if (!data) return [];

        // Support schools from Real-Time RE Data API and ZHomes
        const schools = data.schools || data.nearby_schools || [];

        return schools.map((item: any) => ({
            name: item.name || 'Unknown School',
            // Real-Time RE API uses 'rating'; some APIs use 'score' or 'greatSchoolsRating'
            rating: item.rating ?? item.greatSchoolsRating ?? item.score ?? 'N/A',
            distance: item.distance ?? 0,
            // Real-Time RE API may use 'grades' or 'link' level info
            grades: item.grades || item.level || item.gradeRange || 'K-12',
            // Real-Time RE API includes school type (e.g., 'Elementary', 'High')
            type: item.type || item.schoolType || undefined,
        }));
    } catch (e) {
        console.error("Error parsing schools:", e);
        return [];
    }
}
