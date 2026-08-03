<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBeanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasVerifiedEmail() ?? false;
    }

    public function rules(): array
    {
        return [
            'roastery_name' => ['required', 'string', 'max:255'],
            'roastery_location' => ['nullable', 'string', 'max:255'],
            'roastery_instagram' => ['nullable', 'string', 'max:255'],
            'roastery_website' => ['nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'process_id' => ['nullable', 'integer', 'exists:processes,id'],
            'origin_id' => ['nullable', 'integer', 'exists:origins,id'],
            'variety' => ['nullable', 'string', 'max:255'],
            'flavour_perception' => ['nullable', 'string'],
            'roast_date' => ['nullable', 'date'],
            'roast_level_id' => ['nullable', 'integer', 'exists:roast_levels,id'],
            'purpose_id' => ['nullable', 'integer', 'exists:purposes,id'],
            'purchased_on' => ['nullable', 'date'],
            'altitude' => ['nullable', 'string', 'max:255'],
        ];
    }
}
