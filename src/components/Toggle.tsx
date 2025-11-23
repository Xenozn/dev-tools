interface ToggleProps {
    label: string;
    enabled: boolean;
    setEnabled: (value: boolean) => void;
}

export default function Toggle({ label, enabled, setEnabled }: ToggleProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-300">{label}</span>

            <button
                onClick={() => setEnabled(!enabled)}
                className={`
          w-12 h-6 flex items-center px-1 border transition
          ${enabled
                    ? "bg-green-500/20 border-green-500"
                    : "bg-[#1a1a1a] border-[#333]"
                }
        `}
            >
                <div
                    className={`
            h-4 w-4 bg-white transition
            ${enabled ? "translate-x-6" : "translate-x-0"}
          `}
                />
            </button>
        </div>
    );
}
