import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/filerobot-image-editor.min.js',
                'resources/js/modify-profile-image.js',
                'resources/css/modify-profile-image.css',
            ],
            refresh: true,
        }),
    ],
    build: {
        minify: false
    }
});
