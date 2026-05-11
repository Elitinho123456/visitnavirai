import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { toast, type ToastMessage } from "../../utils/toast";

export default function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const unsubscribe = toast.subscribe((newToast) => {
            setToasts((prev) => [...prev, newToast]);
            // Remove automatically after 4 seconds
            setTimeout(() => {
                removeToast(newToast.id);
            }, 4000);
        });

        return () => unsubscribe();
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const icons = {
        success: <CheckCircle2 className="text-(--color-fern-600) w-5 h-5" />,
        error: <XCircle className="text-(--color-persian-red-600) w-5 h-5" />,
        info: <Info className="text-(--color-mariner-600) w-5 h-5" />,
        warning: <AlertCircle className="text-(--color-selective-yellow-500) w-5 h-5" />
    };

    const borders = {
        success: "border-l-(--color-fern-500)",
        error: "border-l-(--color-persian-red-600)",
        info: "border-l-(--color-mariner-600)",
        warning: "border-l-(--color-selective-yellow-500)"
    };

    return (
        <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className={`pointer-events-auto flex items-start gap-3 p-4 min-w-[320px] max-w-[400px] bg-(--md-surface) border-l-4 rounded-md shadow-2xl ${borders[t.type]}`}
                    >
                        <div className="shrink-0 mt-0.5">{icons[t.type]}</div>
                        <p className="flex-1 text-[0.875rem] font-medium text-(--md-on-surface) leading-relaxed">
                            {t.message}
                        </p>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="shrink-0 p-1 -mt-1 -mr-1 rounded hover:bg-(--md-surface-container-low)/10 transition-colors"
                        >
                            <X className="w-4 h-4 text-(--md-on-surface) hover:text-(--md-on-surface-variant) transition-colors" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
