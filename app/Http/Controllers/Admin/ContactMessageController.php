<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendContactMessageReplyEmail;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::latest()->paginate(10);
        return Inertia::render('Admin/ContactMessages/Index', [
            'messages' => $messages,
        ]);
    }

    public function show(ContactMessage $contactMessage)
    {
        return Inertia::render('Admin/ContactMessages/Show', [
            'message' => $contactMessage,
        ]);
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return redirect()->route('admin.contact-messages.index')->with('success', 'Message deleted successfully!');
    }

    public function reply(Request $request, ContactMessage $contactMessage)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        SendContactMessageReplyEmail::dispatch(
            contactMessageId: $contactMessage->id,
            subject: $validated['subject'],
            replyMessage: $validated['message'],
        )->afterCommit();

        return redirect()
            ->back()
            ->with('success', 'Reply email queued successfully.');
    }
}
