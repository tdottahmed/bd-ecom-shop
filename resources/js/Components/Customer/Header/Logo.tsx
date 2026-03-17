import { Link, usePage } from "@inertiajs/react";

const Logo: React.FC = () => {
    const { siteLogo }: any = usePage().props;

    return (
        <Link
            href="/"
            className="flex-shrink-0 flex items-center justify-center transition-opacity hover:opacity-90"
        >
            <img
                src={siteLogo ? `/storage/${siteLogo}` : "/images/logo.png"}
                alt="Paikari World"
                className="h-8 sm:h-10 w-auto"
            />
        </Link>
    );
};

export default Logo;
