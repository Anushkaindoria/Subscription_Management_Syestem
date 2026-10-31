"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_GROUPS } from "@/config/navigation";
import {
  LayoutDashboard,
  Repeat,
  Users,
  FileSpreadsheet,
  Receipt,
  Zap,
  CreditCard,
  Package,
  CalendarRange,
  Tag,
  Percent,
  BarChart3,
  Sparkles,
  ShieldAlert,
  Settings,
  Search,
  Bell,
  Clock,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Repeat: <Repeat className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  FileSpreadsheet: <FileSpreadsheet className="w-4 h-4" />,
  Receipt: <Receipt className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  CalendarRange: <CalendarRange className="w-4 h-4" />,
  Tag: <Tag className="w-4 h-4" />,
  Percent: <Percent className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentRole: "admin" | "staff" = "admin"; // In production, dynamically parsed from session

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0A0D14] text-slate-900 dark:text-slate-100 font-sans">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (264px desktop fixed, off-canvas on mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[264px] bg-white dark:bg-[#121722] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              ∞
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                LoopOS
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grouped Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {ADMIN_NAV_GROUPS.map((group) => {
            const filteredItems = group.items.filter((item) => {
              if (item.role === "admin" && currentRole !== "admin") return false;
              return true;
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.groupName}>
                <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.groupName}
                </div>
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const isActive =
                      item.path === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.path);

                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-[8px] text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={
                              isActive
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-400 dark:text-slate-500"
                            }
                          >
                            {ICON_MAP[item.iconName] || <ChevronRight className="w-4 h-4" />}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.role === "admin" && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                            ADMIN
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Environment Status */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">MOCK_API Active</span>
          </div>
          <Link
            href="/login"
            className="hover:text-red-500 flex items-center gap-1 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[264px] flex flex-col min-w-0">
        {/* Top Navigation Bar 64px */}
        <header className="h-16 bg-white dark:bg-[#121722] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search subscriptions, invoices..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-[8px] bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Injectable Clock Time-Travel Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span className="tabular-nums">Clock: 2026-10-31</span>
            </div>

            <button
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full absolute top-2 right-2" />
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            {/* User Profile */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                RS
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Riya Sharma
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Admin Operator
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Screen Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
