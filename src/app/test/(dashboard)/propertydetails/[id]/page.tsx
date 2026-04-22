import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, BedDouble, Bath, Square, Calendar, User, Building, Phone, Mail, Clock, ShieldCheck, BadgeCheck, ImageIcon } from 'lucide-react';

async function getProperty(id: string) {
    try {
        const filePath = path.join(process.cwd(), 'resting', 'zillow_raw.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        const properties = data.data || [];
        return properties.find((p: any) => String(p.zpid) === id) || null;
    } catch (error) {
        console.error("Error reading mock data:", error);
        return null;
    }
}

export default async function TestPropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = await getProperty(id);

    if (!property) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Property Not Found in Mock Data</h1>
                    <Link href="/test/propertylist" className="text-emerald-600 hover:underline">Return to List</Link>
                </div>
            </div>
        );
    }

    // Helper to get all images
    const getAllImages = () => {
        const images = [];
        if (property.imgSrc) images.push(property.imgSrc);

        if (property.carouselPhotosComposable?.photoData) {
            const baseUrl = property.carouselPhotosComposable.baseUrl;
            const extraImages = property.carouselPhotosComposable.photoData.map((p: any) =>
                baseUrl.replace('{photoKey}', p.photoKey)
            );
            images.push(...extraImages);
        }
        // Remove duplicates
        return Array.from(new Set(images));
    };

    const images = getAllImages();

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Nav */}
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <Link href="/test/propertylist" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 hover:border-emerald-200">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Test List
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                {property.homeStatus || 'For Sale'}
                            </span>
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {property.homeType || 'Property'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            {property.streetAddress}
                        </h1>
                        <div className="flex items-center gap-2 text-slate-500 font-medium text-lg">
                            <MapPin className="w-5 h-5 text-emerald-500" />
                            {property.city}, {property.state} {property.zipcode}
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-1">
                        <div className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                            ${property.price?.toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">List Price</p>
                    </div>
                </div>

                {/* Gallery Grid (First 5 images) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                    {/* Main Large Image */}
                    <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden shadow-sm group">
                        {images[0] && (
                            <Image src={images[0]} alt="Main" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            view all {images.length} photos
                        </div>
                    </div>

                    {/* Secondary Images */}
                    {images.slice(1, 5).map((img, i) => (
                        <div key={i} className="relative rounded-3xl overflow-hidden shadow-sm group hidden md:block">
                            <Image src={img} alt={`Gallery ${i}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Specs */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-wrap gap-8 md:gap-16 justify-center md:justify-start">
                            <div className="flex flex-col items-center md:items-start gap-1">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <BedDouble className="w-4 h-4" /> Bedrooms
                                </div>
                                <div className="text-3xl font-black text-slate-900">{property.bedrooms}</div>
                            </div>
                            <div className="w-px bg-slate-100 hidden md:block" />
                            <div className="flex flex-col items-center md:items-start gap-1">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <Bath className="w-4 h-4" /> Bathrooms
                                </div>
                                <div className="text-3xl font-black text-slate-900">{property.bathrooms}</div>
                            </div>
                            <div className="w-px bg-slate-100 hidden md:block" />
                            <div className="flex flex-col items-center md:items-start gap-1">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <Square className="w-4 h-4" /> Living Area
                                </div>
                                <div className="text-3xl font-black text-slate-900">{property.livingArea?.toLocaleString()} <span className="text-sm text-slate-400 font-medium">sqft</span></div>
                            </div>
                            <div className="w-px bg-slate-100 hidden md:block" />
                            <div className="flex flex-col items-center md:items-start gap-1">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <Calendar className="w-4 h-4" /> Built
                                </div>
                                <div className="text-3xl font-black text-slate-900">{property.yearBuilt || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">About this home</h3>
                            <p className="text-slate-600 leading-loose text-lg">
                                {property.description || "No description provided in mock data. This property is located in a desirable neighborhood and features modern amenities. Contact the agent for more details or to schedule a viewing."}
                            </p>
                        </div>

                        {/* Agent Card */}
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>

                            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
                                <BadgeCheck className="w-6 h-6 text-emerald-400" />
                                Listing Agent
                            </h3>

                            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
                                    <User className="w-10 h-10 text-slate-500" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-2xl font-bold">{property.info6String || 'Unknown Agent'}</div>
                                        <div className="text-emerald-400 font-medium text-sm flex items-center gap-2 mt-1">
                                            <Building className="w-4 h-4" />
                                            {property.brokerName || 'Unknown Brokerage'}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                                            <Phone className="w-4 h-4" /> Call Agent
                                        </button>
                                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors border border-slate-700">
                                            <Mail className="w-4 h-4" /> Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sticky Stats */}
                    <div className="space-y-8 lg:sticky lg:top-8 h-fit">

                        {/* Open House */}
                        {property.openHouse && (
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 p-6 shadow-lg shadow-emerald-100/50">
                                <h4 className="text-emerald-900 font-bold mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                    Upcoming Open House
                                </h4>
                                <div className="text-lg font-bold text-emerald-800">
                                    {property.openHouse}
                                </div>
                                <p className="text-emerald-600/80 text-sm mt-1">
                                    {property.openHouseDescription}
                                </p>
                            </div>
                        )}

                        {/* Zestimate */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold font-serif">Z</div>
                                <span className="text-slate-900 font-bold">Zestimate®</span>
                            </div>
                            <div className="text-3xl font-black text-slate-900 mb-1">
                                ${property.rentZestimate?.toLocaleString()}<span className="text-lg text-slate-400 font-medium">/mo</span>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Estimated monthly rent</p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
