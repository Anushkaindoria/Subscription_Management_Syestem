"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_GROUPS } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
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
  ChevronDown,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="size-4 shrink-0" />,
  Repeat: <Repeat className="size-4 shrink-0" />,
  Users: <Users className="size-4 shrink-0" />,
  FileSpreadsheet: <FileSpreadsheet className="size-4 shrink-0" />,
  Receipt: <Receipt className="size-4 shrink-0" />,
  Zap: <Zap className="size-4 shrink-0" />,
  CreditCard: <CreditCard className="size-4 shrink-0" />,
  Package: <Package className="size-4 shrink-0" />,
  CalendarRange: <CalendarRange className="size-4 shrink-0" />,
  Tag: <Tag className="size-4 shrink-0" />,
  Percent: <Percent className="size-4 shrink-0" />,
  BarChart3: <BarChart3 className="size-4 shrink-0" />,
  Sparkles: <Sparkles className="size-4 shrink-0" />,
  ShieldAlert: <ShieldAlert className="size-4 shrink-0" />,
  Settings: <Settings className="size-4 shrink-0" />,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentRole: "admin" | "staff" = "admin"; // In production, dynamically read from session

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0A0D14] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-50 selection:text-indigo-600">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (264px desktop fixed, off-canvas on mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[264px] bg-white dark:bg-[#121722] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
                ∞
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    LoopOS
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Brightloop Software
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
            {ADMIN_NAV_GROUPS.map((group) => {
              const filteredItems = group.items.filter((item) => {
                if (item.role === "admin" && currentRole !== "admin") return false;
                return true;
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={group.groupName} className="space-y-1">
                  <div className="px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
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
                              {ICON_MAP[item.iconName] || <ChevronRight className="size-4 shrink-0" />}
                            </span>
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.role === "admin" && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 shrink-0">
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
          </nav>
        </div>

        {/* Bottom Environment Status */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                Global Production
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                99.98% Systems Up
              </span>
            </div>
          </div>
          <Link
            href="/login"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Sign out of console"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[264px] flex flex-col min-w-0">
        {/* Sticky Top Navigation Bar 64px */}
        <header className="h-16 bg-white/90 dark:bg-[#121722]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open navigation sidebar"
            >
              <Menu className="size-5" />
            </button>
            <div className="relative w-full hidden sm:block">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search customers, invoices, subscriptions..."
                className="w-full text-xs pl-9 pr-12 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition placeholder:text-slate-400"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-300">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Run Billing Quick CTA */}
            <Link href="/admin/billing" className="hidden sm:block">
              <Button
                variant="primary"
                size="sm"
                className="text-xs font-semibold shadow-xs"
                leftIcon={<Zap className="size-4" />}
              >
                Run billing
              </Button>
            </Link>

            {/* Fast-Forward Clock Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Clock className="size-4 text-indigo-500" />
              <span className="tabular-nums font-mono">2026-10-31</span>
            </div>

            {/* Notifications Bell */}
            <button
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="size-5" />
              <span className="size-2 bg-red-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {/* User Profile Chip */}
            <div className="flex items-center gap-2.5 pl-1 cursor-pointer select-none group">
              <div className="size-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                RS
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Riya Sharma
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider leading-tight">
                  Admin Operator
                </span>
              </div>
              <ChevronDown className="size-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors hidden sm:block" />
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
