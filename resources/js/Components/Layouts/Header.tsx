import React from "react";
import { Link } from "@inertiajs/react";
import { Globe } from "lucide-react";
import UserMenu from "./UserMenu";
import BrandLogo from "../Utility/BrandLogo";
import NotificationBell from "@/Components/Admin/NotificationBell";

interface User {
    id: number;
    name: string;
    email: string;
    image?: string | null;
}

interface HeaderProps {
    title?: string;
    subtitle?: string;
    showLogo?: boolean;
    logoSize?: "sm" | "md" | "lg";
    showUserMenu?: boolean;
    user?: User;
    actions?: React.ReactNode;
    breadcrumbs?: {
        label: string;
        href?: string;
    }[];
    className?: string;
}

const Header: React.FC<HeaderProps> = ({
    title = "Dashboard",
    subtitle,
    showLogo = false,
    logoSize = "md",
    showUserMenu = false,
    user,
    actions,
    breadcrumbs,
    className = "",
}) => {
    return (
        <header
            className={`bg-[#0E1614] border-b border-[#1E2826] px-2 md:px-6 py-4 ${className}`}
        >
            <div className="flex items-center justify-between">
                {/* Left Section - Logo & Title */}
                <div className="flex items-center space-x-4">
                    {showLogo && (
                        <div className="hidden md:block">
                            <BrandLogo size={logoSize} withText={false} />
                        </div>
                    )}

                    <div className="flex flex-col">
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="flex items-center space-x-2 text-sm mb-1">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        {crumb.href ? (
                                            <a
                                                href={crumb.href}
                                                className="text-gray-400 hover:text-[#2DE3A7] transition-colors"
                                            >
                                                {crumb.label}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">
                                                {crumb.label}
                                            </span>
                                        )}
                                        {index < breadcrumbs.length - 1 && (
                                            <span className="text-gray-600">
                                                /
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </nav>
                        )}

                        {/* Main Title */}
                        <div className="flex items-center space-x-3">
                            <h1 className="text-xl font-semibold text-white md:text-2xl">
                                {title}
                            </h1>

                            {/* Subtitle Badge */}
                            {subtitle && (
                                <span className="px-2 py-1 text-xs font-medium bg-[#2DE3A7]/10 text-[#2DE3A7] border border-[#2DE3A7]/20 rounded-full">
                                    {subtitle}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section - Actions & User Menu */}
                <div className="flex items-center space-x-4">
                    {/* Custom Actions */}
                    {actions && (
                        <div className="flex items-center space-x-2">
                            {actions}
                        </div>
                    )}

                    <NotificationBell />

                    {/* View Frontend Button */}
                    {showUserMenu && (
                        <Link
                            href={route("home")}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1E2826] hover:bg-[#2A3532] border border-[#2DE3A7]/20 hover:border-[#2DE3A7]/40 rounded-lg transition-colors text-sm font-medium text-gray-300 hover:text-[#2DE3A7]"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Globe size={16} />
                            <span className="hidden md:inline">
                                View Frontend
                            </span>
                        </Link>
                    )}

                    {/* User Menu */}
                    {showUserMenu && <UserMenu />}
                </div>
            </div>
        </header>
    );
};

export default Header;
