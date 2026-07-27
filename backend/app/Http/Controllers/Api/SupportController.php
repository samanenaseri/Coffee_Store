<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    public function index(): JsonResponse
    {
        $tickets = auth('api')
            ->user()
            ->supportTickets()
            ->with(['replies' => function ($q) {
                $q->orderBy('created_at');
            }])
            ->latest()
            ->paginate(20);

        return response()->json($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:200',
            'message' => 'required|string',
            'order_id' => 'nullable|exists:orders,id',
            'priority' => 'nullable|string|in:low,normal,high',
        ]);

        $validated['user_id'] = auth('api')->id();
        $validated['status'] = 'open';

        $ticket = SupportTicket::create($validated);

        return response()->json([
            'message' => 'Ticket created successfully.',
            'ticket' => $ticket,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $ticket = auth('api')
            ->user()
            ->supportTickets()
            ->with('replies')
            ->findOrFail($id);

        return response()->json(['ticket' => $ticket]);
    }

    public function reply(Request $request, $id): JsonResponse
    {
        $ticket = auth('api')->user()->supportTickets()->findOrFail($id);

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        SupportTicketReply::create([
            'ticket_id' => $ticket->id,
            'sender' => 'user',
            'message' => $validated['message'],
        ]);

        // After customer reply, ticket is waiting for admin review
        $ticket->update(['status' => 'in_progress']);

        return response()->json([
            'message' => 'Reply sent successfully.',
            'ticket' => $ticket->fresh()->load('replies'),
        ]);
    }
}
