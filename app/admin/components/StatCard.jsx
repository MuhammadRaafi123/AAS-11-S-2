    export default function StatCard({ title, value, color = "blue" }) {
    const colors = {
        blue: "text-blue-600",
        green: "text-green-600",
        yellow: "text-yellow-500",
        red: "text-red-500",
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow">
        <h4 className="text-gray-500 text-sm">{title}</h4>
        <p className={`text-2xl font-bold ${colors[color]}`}>
            {value}
        </p>
        </div>
    );
    }