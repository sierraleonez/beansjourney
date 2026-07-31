<?php

namespace App\Http\Requests;

use App\Models\Comment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasVerifiedEmail() ?? false;
    }

    public function rules(): array
    {
        return [
            'commentable_type' => ['required', 'in:review,recipe'],
            'commentable_id' => ['required', 'integer'],
            'parent_id' => ['nullable', 'integer', 'exists:comments,id'],
            'body' => ['required', 'string', 'min:1', 'max:5000'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $parentId = $this->input('parent_id');
                if (! $parentId) {
                    return;
                }

                $parent = Comment::find($parentId);
                $commentable = $this->commentable();

                if (! $parent || ! $commentable) {
                    $validator->errors()->add('parent_id', 'The parent comment is invalid.');

                    return;
                }

                if ($parent->commentable_type !== $commentable->getMorphClass() || $parent->commentable_id !== $commentable->getKey()) {
                    $validator->errors()->add('parent_id', 'The parent comment does not belong to this thread.');
                }
            },
        ];
    }

    public function commentable(): mixed
    {
        $type = $this->input('commentable_type');
        $model = $type === 'recipe' ? \App\Models\Recipe::class : \App\Models\Review::class;

        return $model::withTrashed()->find($this->input('commentable_id'));
    }
}
