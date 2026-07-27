<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSupportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SupportTicket::with('user')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $tickets = $query->paginate(20);

        return response()->json($tickets);
    }

    public function show(SupportTicket $supportTicket): JsonResponse
    {
        $supportTicket->load(['replies', 'user']);

        $data = $supportTicket->toArray();
        $data['description'] = $supportTicket->message;

        if (isset($data['replies'])) {
            $data['replies'] = array_map(function ($reply) {
                $reply['is_admin_reply'] = ($reply['sender'] ?? '') === 'admin';
                return $reply;
            }, $data['replies']);
        }

        return response()->json($data);
    }

    public function reply(Request $request, SupportTicket $supportTicket): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $reply = SupportTicketReply::create([
            'ticket_id' => $supportTicket->id,
            'sender' => 'admin',
            'message' => $validated['message'],
        ]);

        // Frontend status map uses: open | in_progress | answered | closed
        $supportTicket->update(['status' => 'answered']);

        $replyData = $reply->toArray();
        $replyData['is_admin_reply'] = true;

        return response()->json($replyData, 201);
    }

    public function updateStatus(Request $request, SupportTicket $supportTicket): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        $supportTicket->update(['status' => $validated['status']]);

        return response()->json($supportTicket);
    }
}
