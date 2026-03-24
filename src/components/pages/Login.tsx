import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

//É PRECISO ADCIONAR ISSO DE OPÇÃO
//gestor de informações gerais, gestor de pousadas, gestor de turismo, gestor alimenticio, gestor de serviços, gestor de eventos, gestor chefe


// Components
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isRegistering ? `http://localhost:${import.meta.env.VITE_API_PORT}/auth/register` : `http://localhost:${import.meta.env.VITE_API_PORT}/auth/login`;
            const bodyData = isRegistering ? { email, password, confirmPassword, name } : { email, password };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            if (response.ok) {
                if (!isRegistering) {
                    localStorage.setItem('token', data.token);

                    // Decode token logic here is not strictly necessary if data.user is returned, 
                    // assuming the backend was updated to return `user: { role: ...}`. 
                    // Safe approach: verify via token structure.
                    try {
                        const payload = data.token.split(".")[1];
                        const decoded = JSON.parse(atob(payload));
                        if (decoded.role === "admin") {
                            navigate('/admin');
                        } else {
                            navigate('/');
                        }
                    } catch (e) {
                        // Fallback just in case
                        navigate('/');
                    }
                } else {
                    alert(t('login.register_success'));
                    setIsRegistering(false);
                }
            } else {
                alert(data.message || (isRegistering ? t('login.error_register') : t('login.error_login')));
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(t('login.error_connection'));
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background) overflow-hidden">
            <Header />
            <main className="grow relative flex items-center justify-center min-h-[calc(100vh-100px)]">

                {/* Background Decorativo Estilo Magic UI */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-(--color-primary)/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
                    <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-(--color-accent-gold)/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-(--color-tertiary)/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714571954/grid_r1h3y8.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="w-full max-w-md p-4 z-10">
                    <motion.div
                        layout
                        className="bg-white/70 dark:bg-(--color-neutral-white)/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden relative"
                    >
                        {/* Brilho da Borda (Magic UI Glow) */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-(--color-primary)/20 dark:ring-(--color-primary)/50 pointer-events-none" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isRegistering ? "register" : "login"}
                                initial={{ opacity: 0, x: isRegistering ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isRegistering ? -20 : 20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-(--color-primary) to-(--color-tertiary) mb-2">
                                    {isRegistering ? t('login.register_title') : t('login.title')}
                                </h1>
                                <p className="text-(--color-neutral-gray) mb-8">
                                    {isRegistering ? t('login.register_subtitle') : t('login.login_subtitle')}
                                </p>

                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-(--color-text-header) mb-1 ml-1" htmlFor="email">
                                            {t('login.email')}
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                            <input
                                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-(--color-neutral-light) border border-(--color-neutral-gray)/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm"
                                                type="email"
                                                id="email"
                                                placeholder={t('login.email_placeholder')}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-(--color-text-header) mb-1 ml-1" htmlFor="password">
                                            {t('login.password')}
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                            <input
                                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-(--color-neutral-light) border border-(--color-neutral-gray)/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm"
                                                type="password"
                                                id="password"
                                                placeholder={t('login.password_placeholder')}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isRegistering && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            >
                                                <label className="block text-sm font-bold text-(--color-text-header) mb-1 ml-1" htmlFor="confirmPassword">
                                                    {t('login.confirm_password')}
                                                </label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                                    <input
                                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-(--color-neutral-light) border border-(--color-neutral-gray)/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm"
                                                        type="password"
                                                        id="confirmPassword"
                                                        placeholder={t('login.confirm_password_placeholder')}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>


                                                <label className="block text-sm font-bold text-(--color-text-header) mb-1 ml-1" htmlFor="name">
                                                    {t('login.name')}
                                                </label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                                    <input
                                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-(--color-neutral-light) border border-(--color-neutral-gray)/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm"
                                                        type="text"
                                                        id="name"
                                                        placeholder={t('login.name_placeholder')}
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="pt-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-(--color-primary) text-white font-bold py-3 rounded-xl hover:bg-(--color-primary-dark) transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                                            type="submit"
                                        >
                                            {isRegistering ? t('login.register') : t('login.login')}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </motion.button>
                                    </div>
                                </form>

                                <div className="mt-8 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsRegistering(!isRegistering)}
                                        className="text-sm font-bold text-(--color-secondary) hover:text-(--color-tertiary) transition-colors hover:underline cursor-pointer"
                                    >
                                        {isRegistering ? t('login.switch_to_login') : t('login.switch_to_register')}
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}