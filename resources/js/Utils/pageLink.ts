type NavPage = {
    slug: string;
};

/**
 * Maps CMS page slugs to their canonical public routes.
 */
export function resolvePageHref(page: NavPage): string {
    switch (page.slug) {
        case "about-us":
            return route("pages.about");
        case "contact-us":
            return route("pages.contact");
        case "faq":
            return route("pages.faq");
        case "privacy-policy":
            return route("pages.privacy-policy");
        case "terms-and-conditions":
        case "terms-conditions":
            return route("pages.terms");
        default:
            return route("pages.show", page.slug);
    }
}
