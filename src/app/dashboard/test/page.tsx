
export default function DashboardTestPage() {
    return (
        <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200">
            <h1 className="text-2xl font-bold mb-4">Dashboard Isolation Test</h1>
            <p className="text-stone-600">
                If you can see this page, the **Dashboard Layout**, **Sidebar**, and **Auth Middleware** are working correctly.
            </p>
            <div className="mt-8 p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
                <p className="text-sm font-mono text-emerald-700">Status: Rendered on Server</p>
            </div>
        </div>
    );
}
