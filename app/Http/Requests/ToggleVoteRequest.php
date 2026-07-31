<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ToggleVoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasVerifiedEmail() ?? false;
    }

    public function rules(): array
    {
        return [
            'votable_type' => ['required', 'in:review,recipe,comment'],
            'votable_id' => ['required', 'integer'],
        ];
    }

    public function votable(): mixed
    {
        return match ($this->input('votable_type')) {
            'review' => \App\Models\Review::withTrashed()->find($this->input('votable_id')),
            'recipe' => \App\Models\Recipe::withTrashed()->find($this->input('votable_id')),
            default => \App\Models\Comment::withTrashed()->find($this->input('votable_id')),
        };
    }
}
