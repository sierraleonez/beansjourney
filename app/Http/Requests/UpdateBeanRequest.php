<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBeanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['image', 'max:4096'],
            'remove_photo_ids' => ['nullable', 'array'],
            'remove_photo_ids.*' => ['integer', 'exists:bean_photos,id'],
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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $bean = $this->route('bean');

            if (! $bean) {
                return;
            }

            $removeCount = count($this->input('remove_photo_ids', []));
            $newCount = count($this->file('photos', []));
            $remainingCount = $bean->photos()->count() - $removeCount + $newCount;

            if ($remainingCount > 5) {
                $validator->errors()->add('photos', 'Maksimal 5 foto per bean.');
            }
        });
    }
}
