"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Star, LayoutDashboard, MessageSquare, Settings, LogOut, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-zinc-500" size={32} />
      </div>
    );
  }

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Avaliações", icon: MessageSquare, href: "/dashboard/reviews" },
    { name: "Configurações", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col p-6 fixed inset-y-0 hidden md:flex bg-card/50 backdrop-blur-sm z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter mb-12 text-foreground">
          <div className="bg-foreground text-background p-1 rounded-lg">
            <Star size={20} fill="currentColor" />
          </div>
          AvaliaPró
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
          
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 overflow-auto pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/10 p-4 pb-safe flex justify-around items-center z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive ? "text-primary" : "text-zinc-500 hover:text-white"
              }`}
            >
              <div className={isActive ? "bg-primary/20 p-1.5 rounded-lg" : "p-1.5"}>
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-zinc-500 hover:text-red-500 transition-all"
        >
          <div className="p-1.5">
            <LogOut size={20} />
          </div>
          <span className="text-[10px] font-bold">Sair</span>
        </button>
      </nav>
    </div>
  );
}
