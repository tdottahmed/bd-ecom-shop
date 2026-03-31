<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;

class PageController extends Controller
{
    public function show(string $slug)
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('Customer/Page', [
            'page' => $page->only(['title', 'slug', 'content']),
        ]);
    }

    public function about()
    {
        $page = Page::where('slug', 'about-us')->where('is_published', true)->first();
        return Inertia::render('Customer/About', [
            'page' => $page ? $page->only(['title', 'slug', 'content']) : null,
            'stats' => json_decode(get_setting('about_stats', '[]'), true),
            'testimonials' => json_decode(get_setting('about_testimonials', '[]'), true),
        ]);
    }

    public function contact()
    {
        $page = Page::where('slug', 'contact-us')->where('is_published', true)->first();
        $faqs = json_decode(get_setting('faqs', '[]'), true);
        return Inertia::render('Customer/Contact', [
            'page' => $page ? $page->only(['title', 'slug', 'content']) : null,
            'faqs' => $faqs,
            'contactInfo' => [
                'address'   => get_setting('contact_address', 'Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia'),
                'phone'     => get_setting('contact_phone', '+60 3 1234 5678'),
                'email'     => get_setting('contact_email', 'support@truebymalaysia.com'),
                'hours'     => get_setting('contact_hours', 'Mon–Fri: 9am–6pm, Sat: 10am–2pm'),
                'map_embed' => get_setting('contact_map_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.751352458897!2d101.7093247!3d3.159495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d12d669c1f%3A0x9e3afdd17c8a9056!2sPetronas%20Twin%20Towers!5e0!3m2!1sen!2smy!4v1711867123456!5m2!1sen!2smy'),
            ],
        ]);
    }

    public function faq()
    {
        $faqs = json_decode(get_setting('faqs', '[]'), true);
        return Inertia::render('Customer/Faq', [
            'faqs' => $faqs,
        ]);
    }

    public function privacyPolicy()
    {
        $page = Page::where('slug', 'privacy-policy')->where('is_published', true)->first();
        return Inertia::render('Customer/PrivacyPolicy', [
            'page' => $page ? $page->only(['title', 'slug', 'content']) : null,
        ]);
    }

    public function termsConditions()
    {
        $page = Page::where('slug', 'terms-and-conditions')->where('is_published', true)->first();
        return Inertia::render('Customer/TermsConditions', [
            'page' => $page ? $page->only(['title', 'slug', 'content']) : null,
        ]);
    }
}

