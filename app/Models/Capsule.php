<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capsule extends Model
{
    protected $fillable = [
        'title',
        'description',
        'images',
        'image_comments',
        'time',
        'vision',
        'privacy',
        'design',
        'status',
        'user_id'
    ];

    protected $casts = [
        'images' => 'array',
        'image_comments' => 'array',
        'time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sharedUsers()
    {
        return $this->belongsToMany(User::class, 'capsule_user')
                    ->withTimestamps();
    }
}