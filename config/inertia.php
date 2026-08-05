<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    | Overrides the package default of `resources/js/pages` (lowercase) to
    | match this project's actual `resources/js/Pages` directory. On macOS
    | the case-insensitive filesystem hides the mismatch, but CI runs on
    | Linux (case-sensitive), where the default path silently resolves to
    | nothing — causing assertInertia()'s ->component() check to fail with
    | "Inertia page component file [...] does not exist." even though the
    | file is right there.
    |
    */

    'pages' => [

        'ensure_pages_exist' => false,

        'paths' => [

            resource_path('js/Pages'),

        ],

        'extensions' => [

            'js',
            'jsx',
            'svelte',
            'ts',
            'tsx',
            'vue',

        ],

    ],

];
