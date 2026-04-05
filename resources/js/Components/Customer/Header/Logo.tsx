import { Link, usePage } from "@inertiajs/react";

const Logo: React.FC = () => {
    const { siteLogo }: any = usePage().props;

    const resolvedLogoSrc = (() => {
        if (!siteLogo) return "/images/logo.png";

        const raw = String(siteLogo).trim();
        if (!raw) return "/images/logo.png";

        // If it's already a full URL, use it directly.
        if (
            raw.startsWith("http://") ||
            raw.startsWith("https://") ||
            raw.startsWith("//")
        ) {
            return raw;
        }

        // Common stored formats:
        // - "foo.png"
        // - "storage/foo.png"
        // - "/storage/foo.png"
        const clean = raw.replace(/^\/+/, "").replace(/^storage\//, "");
        return `/storage/${clean}`;
    })();

    return (
        <Link
            href="/"
            className="flex-shrink-0 flex items-center justify-center transition-opacity hover:opacity-90"
        >
            <img
                src={resolvedLogoSrc}
                alt="Paikari World"
                className="h-10 sm:h-14 w-auto"
            />
        </Link>
    );
};

export default Logo;
