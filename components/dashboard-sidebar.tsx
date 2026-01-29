'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Bell, Settings, CreditCard, LogOut, User, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
]

export function DashboardSidebar({ userEmail, planName }: { userEmail: string, planName: string }) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col w-64 bg-slate-950 border-r border-slate-800 min-h-screen">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                    {/* Official Logo */}
                    <Link href="/dashboard" className="h-8 w-48 relative block">
                        <img src="/dot-brand-transparent.png" alt="DOT Risk Radar" className="h-full w-full object-contain object-left" />
                    </Link>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-slate-800/50 bg-slate-950 space-y-4">
                {/* Upgrade Button Removed for Phase 1.7 */}

                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400">
                            <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{userEmail}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 capitalize">{planName} Plan</span>
                            </div>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="w-full border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
