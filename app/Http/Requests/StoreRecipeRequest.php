<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasVerifiedEmail() ?? false;
    }

    public function rules(): array
    {
        return [
            'brew_method' => ['required', 'in:americano,espresso,v60,french_press,aeropress,tubruk,other'],
            'tools' => ['nullable', 'array', 'max:20'],
            'tools.*' => ['string', 'max:255'],
            'process' => ['nullable', 'string', 'max:10000'],
            'tasting_notes' => ['nullable', 'string', 'max:5000'],
            'dose_ratio' => ['nullable', 'string', 'max:100'],
            'grind_size' => ['nullable', 'string', 'max:100'],
            'water_temp' => ['nullable', 'string', 'max:100'],
        ];
    }
}
