<x-mail::layout>
{{-- Header --}}
<x-slot:header>
<x-mail::header :url="config('app.url')">
<span style="display: inline-flex; align-items: center; gap: 8px; vertical-align: middle;">
<span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 9999px; background-color: #5C3317; font-size: 16px; line-height: 32px; text-align: center;">🫘</span>
<span style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 700; color: #3B1F0E;">{{ config('app.name') }}</span>
</span>
</x-mail::header>
</x-slot:header>

{{-- Body --}}
{!! $slot !!}

{{-- Subcopy --}}
@isset($subcopy)
<x-slot:subcopy>
<x-mail::subcopy>
{!! $subcopy !!}
</x-mail::subcopy>
</x-slot:subcopy>
@endisset

{{-- Footer --}}
<x-slot:footer>
<x-mail::footer>
© {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}
</x-mail::footer>
</x-slot:footer>
</x-mail::layout>
