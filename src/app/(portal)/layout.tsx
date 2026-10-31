"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PORTAL_NAV_ITEMS } from "@/config/navigation";
import { Home, RefreshCw, FileText, User, Building, LogOut } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Home: <Home className="w-4 h-4" />,
  RefreshCw: <RefreshCw className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
};

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0A0D14] text-slate-900 dark:text-slate-100 font-sans pb-16 md:pb-0">
      {/* Top Navigation Bar (Desktop) */}
      <header className="bg-white dark:bg-[#121722] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/portal" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                ∞
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  LoopOS
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  PORTAL
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {PORTAL_NAV_ITEMS.map((item) => {
                const isActive =
                  item.path === "/portal"
                    ? pathname === "/portal"
                    : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {ICON_MAP[item.iconName] || null}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-[8px] bg-slate-100 dark:bg-slate-800/80 text-xs">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Acme Retail Pvt Ltd
              </span>
              <span className="text-[10px] text-slate-400 font-mono">07AABCA1234F1Z5</span>
            </div>

            <Link
              href="/login"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        {children}
      </main>

      {/* Bottom Tab Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#121722] border-t border-slate-200 dark:border-slate-800 flex justify-around items-center z-40 px-2 shadow-lg">
        {PORTAL_NAV_ITEMS.map((item) => {
          const isActive =
            item.path === "/portal"
              ? pathname === "/portal"
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {ICON_MAP[item.iconName]}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
