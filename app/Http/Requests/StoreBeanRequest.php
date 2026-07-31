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
            'name' => ['required', 'string', 'max:255'],
            'process' => ['nullable', 'string', 'max:255'],
            'origin' => ['nullable', 'string', 'max:255'],
            'variety' => ['nullable', 'string', 'max:255'],
            'flavour_perception' => ['nullable', 'string'],
            'roast_date' => ['nullable', 'date'],
            'roast_profile' => ['nullable', 'string', 'max:255'],
            'purpose' => ['nullable', 'string', 'max:255'],
            'purchased_on' => ['nullable', 'date'],
            'altitude' => ['nullable', 'string', 'max:255'],
        ];
    }
}
