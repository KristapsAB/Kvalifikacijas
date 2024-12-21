<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Capsule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CapsuleController extends Controller
{
    public function uploadImages(Request $request)
    {
        try {
            Log::info('Raw request data:', $request->all());

            $validatedData = $request->validate([
                'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image_comments.*' => 'nullable|string',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'time' => 'required|date',
            ]);

            Log::info('Validated data:', $validatedData);

            $uploadedImages = [];
            $imageComments = [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $filePath = $image->store('capsules', 'public');
                    $uploadedImages[] = $filePath;
                    $comment = $request->input("image_comments.$index");
                    $imageComments[$filePath] = $comment !== null ? $comment : '';
                    Log::info('Image uploaded', ['path' => $filePath, 'comment' => $imageComments[$filePath]]);
                }
            }

            $user = Auth::user();

            if (!$user) {
                throw new \Exception('User not authenticated');
            }

            $time = Carbon::parse($validatedData['time']);
            Log::info('Parsed time:', ['time' => $time->toDateTimeString()]);

            $capsule = $user->capsules()->create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'images' => json_encode($uploadedImages),
                'image_comments' => json_encode($imageComments),
                'time' => $time,
            ]);

            Log::info('Capsule created', [
                'id' => $capsule->id, 
                'user_id' => $user->id, 
                'time' => $capsule->time,
                'image_comments' => $imageComments
            ]);

            return response()->json([
                'message' => 'Capsule created successfully',
                'capsule_id' => $capsule->id,
                'images' => $uploadedImages,
                'image_comments' => $imageComments,
                'time' => $time->toDateTimeString()
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in uploadImages', [
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error in uploadImages', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'An error occurred while creating the capsule',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function create(Request $request)
    {
        try {
            Log::info('Raw request data in create method:', $request->all());
    
            $validatedData = $request->validate([
                'images' => 'required|array',
                'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image_comments.*' => 'nullable|string',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'time' => 'required|date',
                'vision' => 'required|string',
                'privacy' => 'required|in:private,friends,public',
                'design' => 'required|string',
                'shared_with' => 'nullable|array',
                'shared_with.*' => 'exists:users,id',
            ]);
    
            Log::info('Validated data in create method:', $validatedData);
    
            $uploadedImages = [];
            $imageComments = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $filePath = $image->store('capsules', 'public');
                    $uploadedImages[] = $filePath;
                    $comment = $request->input("image_comments.$index");
                    $imageComments[$filePath] = $comment !== null ? $comment : '';
                    Log::info('Image uploaded in create method', ['path' => $filePath, 'comment' => $imageComments[$filePath]]);
                }
            }
    
            $user = Auth::user();
            if (!$user) {
                throw new \Exception('User not authenticated');
            }
    
            $time = Carbon::parse($validatedData['time']);
            Log::info('Parsed time in create method:', ['time' => $time->toDateTimeString()]);
    
            $capsule = $user->capsules()->create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'images' => json_encode($uploadedImages),
                'image_comments' => json_encode($imageComments),
                'time' => $time,
                'vision' => $validatedData['vision'],
                'privacy' => $validatedData['privacy'],
                'design' => $validatedData['design'],
                'status' => isset($validatedData['shared_with']) ? 'pending' : 'completed',
            ]);
    
            Log::info('Capsule created in create method', [
                'id' => $capsule->id, 
                'user_id' => $user->id, 
                'time' => $capsule->time,
                'vision' => $capsule->vision,
                'privacy' => $capsule->privacy,
                'design' => $capsule->design,
                'status' => $capsule->status,
            ]);
    
            if (!empty($validatedData['shared_with'])) {
                Log::info('Attaching shared users to capsule', ['shared_with' => $validatedData['shared_with']]);
                $capsule->sharedUsers()->attach($validatedData['shared_with']);
            }
    
            return response()->json([
                'message' => 'Capsule created successfully',
                'capsule_id' => $capsule->id,
                'images' => $uploadedImages,
                'image_comments' => $imageComments,
                'time' => $time->toDateTimeString(),
                'vision' => $capsule->vision,
                'privacy' => $capsule->privacy,
                'design' => $capsule->design,
                'shared_with' => $capsule->sharedUsers()->pluck('users.id'),
                'status' => $capsule->status,
            ], 201);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in create method', [
                'errors' => $e->errors(),
            ]);
    
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
    
        } catch (\Exception $e) {
            Log::error('Error in create method', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
    
            return response()->json([
                'message' => 'An error occurred while creating the capsule',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getCapsuleCount()
    {
        try {
            $userId = Auth::id();
            Log::info('User ID:', ['user_id' => $userId]);
            
            $count = Capsule::where('user_id', $userId)->count();
            Log::info('Capsule count retrieved', ['count' => $count]);
    
            return response()->json(['count' => $count]);
        } catch (\Exception $e) {
            Log::error('Error in getCapsuleCount', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
    
            return response()->json([
                'message' => 'An error occurred while retrieving capsule count',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
        //commit vajag sito pielikt testam
    public function updateImageComment(Request $request, $capsuleId)
    {
        try {
            Log::info('Update image comment request data:', $request->all());

            $capsule = Capsule::findOrFail($capsuleId);
            $validatedData = $request->validate([
                'image_path' => 'required|string',
                'comment' => 'required|string',
            ]);

            $imageComments = json_decode($capsule->image_comments, true) ?: [];
            $imageComments[$validatedData['image_path']] = $validatedData['comment'];

            $capsule->update(['image_comments' => json_encode($imageComments)]);

            Log::info('Image comment updated', [
                'capsule_id' => $capsuleId,
                'image_path' => $validatedData['image_path'],
                'comment' => $validatedData['comment']
            ]);

            return response()->json(['message' => 'Image comment updated successfully']);
        } catch (\Exception $e) {
            Log::error('Error in updateImageComment', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'An error occurred while updating image comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getMonthlyStats()
{
    try {
        $currentYear = Carbon::now()->year;
        
        // Get counts of capsules grouped by creation month
        $monthlyStats = Capsule::selectRaw('MONTH(created_at) as month, COUNT(*) as total_created')
            ->whereYear('created_at', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get();
            
        // Initialize all months with zero counts
        $formattedStats = collect(range(1, 12))->mapWithKeys(function ($month) {
            return [$month => [
                'month' => Carbon::create()->month($month)->format('M'),
                'created' => 0,
                'scheduled' => 0,
                'private' => 0,
                'public' => 0,
                'friends' => 0
            ]];
        });
        
        // Get detailed stats for each month
        $detailedStats = Capsule::selectRaw('
            MONTH(created_at) as month,
            COUNT(*) as total_created,
            SUM(CASE WHEN privacy = "private" THEN 1 ELSE 0 END) as private_count,
            SUM(CASE WHEN privacy = "public" THEN 1 ELSE 0 END) as public_count,
            SUM(CASE WHEN privacy = "friends" THEN 1 ELSE 0 END) as friends_count
        ')
        ->whereYear('created_at', $currentYear)
        ->groupBy('month')
        ->get();
        
        // Fill in actual counts
        $detailedStats->each(function ($stat) use (&$formattedStats) {
            $formattedStats[$stat->month] = [
                'month' => Carbon::create()->month($stat->month)->format('M'),
                'created' => $stat->total_created,
                'private' => $stat->private_count,
                'public' => $stat->public_count,
                'friends' => $stat->friends_count
            ];
        });

        $response = $formattedStats->values();

        Log::info('Monthly creation stats retrieved', ['stats' => $response]);
        
        return response()->json($response);
        
    } catch (\Exception $e) {
        Log::error('Error in getMonthlyStats', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'message' => 'An error occurred while retrieving monthly stats',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
