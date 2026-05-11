import { useState } from "react";
import { Mail, Lock, ArrowRight, User, UserPlus, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, apiFetch } from "../../config/api";
import { toast } from "../../utils/toast";
import { useAuth } from "@/contexts/AuthContext";

import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function Login() {
    const { authenticate } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiFetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                try {
                    await authenticate(data.token);
                    const payload = data.token.split(".")[1];
                    const decoded = JSON.parse(atob(payload));
                    if (decoded.role !== "user") {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                } catch (e) {
                    navigate('/');
                }
            } else {
                toast.error(data.message || 'Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro:', error);
            toast.error('Erro de conexão com o servidor');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.warning('As senhas não coincidem!');
            return;
        }

        try {
            const response = await apiFetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, confirmPassword, name }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Conta criada com sucesso!');
                setIsRegistering(false);
                setPassword('');
                setConfirmPassword('');
                setName('');
            } else {
                toast.error(data.message || 'Erro ao criar conta');
            }
        } catch (error) {
            console.error('Erro:', error);
            toast.error('Erro de conexão com o servidor');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background) overflow-hidden">
            <Header />
            <main className="grow relative flex items-center justify-center min-h-[calc(100vh-100px)] py-12">

                {/* Animated Background */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-linear-to-br from-(--color-primary)/20 to-(--color-secondary)/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
                    <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-linear-to-bl from-(--color-accent-gold)/20 to-(--color-primary)/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-linear-to-t from-(--color-tertiary)/20 to-(--color-secondary)/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
                    <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714571954/grid_r1h3y8.svg')] bg-center opacity-30 mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="w-full max-w-md px-4 z-10">
                    <motion.div
                        layout
                        className="bg-white/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-10 overflow-hidden relative"
                    >
                        {/* Shimmer effect border */}
                        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-(--color-primary)/10 dark:ring-white/5 pointer-events-none" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-(--color-primary)/30 to-transparent" />

                        <AnimatePresence mode="wait">
                            {isRegistering ? (
                                <motion.div
                                    key="register"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="mb-8 text-center">
                                        <div className="w-16 h-16 bg-(--color-primary)/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-(--color-primary)">
                                            <UserPlus size={32} />
                                        </div>
                                        <h1 className="text-3xl font-black text-(--color-text-header) tracking-tight mb-2">
                                            Criar Conta
                                        </h1>
                                        <p className="text-(--color-neutral-gray) text-sm font-medium">
                                            Junte-se a nós para explorar Naviraí.
                                        </p>
                                    </div>

                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-(--color-text-body) uppercase tracking-wider mb-1.5 ml-1" htmlFor="name">
                                                Nome Completo
                                            </label>
                                            <div className="relative group">
                                                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                                <input
                                                    className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-(--color-neutral-light)/10 border border-(--color-neutral-gray)/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm placeholder:text-(--color-neutral-gray)/60"
                                                    type="text" id="name" placeholder="João da Silva"
                                                    value={name} onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-(--color-text-body) uppercase tracking-wider mb-1.5 ml-1" htmlFor="email-reg">
                                                E-mail
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                                <input
                                                    className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-(--color-neutral-light)/10 border border-(--color-neutral-gray)/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm placeholder:text-(--color-neutral-gray)/60"
                                                    type="email" id="email-reg" placeholder="joao@exemplo.com"
                                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-(--color-text-body) uppercase tracking-wider mb-1.5 ml-1" htmlFor="password-reg">
                                                Senha
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                                <input
                                                    className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-(--color-neutral-light)/10 border border-(--color-neutral-gray)/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm placeholder:text-(--color-neutral-gray)/60"
                                                    type="password" id="password-reg" placeholder="••••••••"
                                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-(--color-text-body) uppercase tracking-wider mb-1.5 ml-1" htmlFor="confirmPassword">
                                                Confirmar Senha
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                                <input
                                                    className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-(--color-neutral-light)/10 border border-(--color-neutral-gray)/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm placeholder:text-(--color-neutral-gray)/60"
                                                    type="password" id="confirmPassword" placeholder="••••••••"
                                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-linear-to-r from-(--color-primary) to-(--color-secondary) text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)] transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                                                type="submit"
                                            >
                                                Cadastrar-se
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </motion.button>
                                        </div>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <p className="text-(--color-neutral-gray) text-sm">
                                            Já tem uma conta?{' '}
                                            <button
                                                type="button"
                                                onClick={() => setIsRegistering(false)}
                                                className="font-bold text-(--color-primary) hover:text-(--color-secondary) transition-colors cursor-pointer"
                                            >
                                                Entrar
                                            </button>
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="mb-8 text-center">
                                        <div className="w-16 h-16 bg-(--color-primary)/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-(--color-primary)">
                                            <LogIn size={32} />
                                        </div>
                                        <h1 className="text-3xl font-black text-(--color-text-header) tracking-tight mb-2">
                                            Bem-vindo de volta
                                        </h1>
                                        <p className="text-(--color-neutral-gray) text-sm font-medium">
                                            Insira suas credenciais para acessar sua conta.
                                        </p>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-(--color-text-body) uppercase tracking-wider mb-1.5 ml-1" htmlFor="email-login">
                                                E-mail
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                                <input
                                                    className="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-(--color-neutral-light)/10 border border-(--color-neutral-gray)/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm placeholder:text-(--color-neutral-gray)/60"
                                                    type="email" id="email-login" placeholder="joao@exemplo.com"
                                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                                                <label className="block text-xs font-bold text-(--color-text-body) uppercase tracking-wider" htmlFor="password-login">
                                                    Senha
                                                </label>
                                                <a href="#" className="text-xs font-semibold text-(--color-primary) hover:text-(--color-secondary) transition-colors">
                                                    Esqueceu a senha?
                                                </a>
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-neutral-gray) group-focus-within:text-(--color-primary) transition-colors" />
                                                <input
                                                    className="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-(--color-neutral-light)/10 border border-(--color-neutral-gray)/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) transition-all shadow-sm placeholder:text-(--color-neutral-gray)/60"
                                                    type="password" id="password-login" placeholder="••••••••"
                                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-linear-to-r from-(--color-primary) to-(--color-secondary) text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)] transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                                                type="submit"
                                            >
                                                Entrar na Conta
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </motion.button>
                                        </div>
                                    </form>

                                    <div className="mt-8 text-center">
                                        <p className="text-(--color-neutral-gray) text-sm">
                                            Novo por aqui?{' '}
                                            <button
                                                type="button"
                                                onClick={() => setIsRegistering(true)}
                                                className="font-bold text-(--color-primary) hover:text-(--color-secondary) transition-colors cursor-pointer"
                                            >
                                                Crie sua conta
                                            </button>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}