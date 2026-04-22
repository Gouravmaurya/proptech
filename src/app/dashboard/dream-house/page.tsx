import DreamHouseMatcher from "@/components/DreamHouseMatcher";

export const metadata = {
    title: "Dream House Matcher | Haven AI",
    description: "Upload your inspiration and let our AI find your perfect match.",
};

export default function DreamHousePage() {
    return (
        <div className="w-full h-full">
            <DreamHouseMatcher />
        </div>
    );
}
