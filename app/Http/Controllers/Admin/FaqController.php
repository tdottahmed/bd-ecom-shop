<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Faq/Index', [
            'faqs' => json_decode(get_setting('faqs', '[]'), true),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'faqs' => 'nullable|array',
            'faqs.*.question' => 'required|string|max:500',
            'faqs.*.answer' => 'required|string|max:2000',
        ]);

        $faqs = collect($request->faqs ?? [])->filter(function ($faq) {
            return ! empty($faq['question']) && ! empty($faq['answer']);
        })->values()->toArray();

        Setting::updateOrCreate(['key' => 'faqs'], ['value' => json_encode($faqs)]);

        return back()->with('success', 'FAQs updated successfully.');
    }
}
