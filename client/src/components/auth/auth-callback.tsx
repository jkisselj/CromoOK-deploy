import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "@/lib/supabaseClient";

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const queryParams = new URLSearchParams(location.search);
            const redirectTo = queryParams.get("redirectTo") || "/";

            try {
                const { error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth callback error:", error);
                    setError(error.message);
                    return;
                }

                const cleanRedirectPath = redirectTo.replace(/^\/?(#\/?)?/, "/");
                navigate(cleanRedirectPath, { replace: true });
            } catch (err) {
                console.error("Unexpected auth callback error:", err);
                setError("An unexpected error occurred during login processing.");
            }
        };

        handleAuthCallback();
    }, [navigate, location]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => navigate("/auth/login")}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                    Return to Login Page
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg">Logging in...</p>
        </div>
    );
}