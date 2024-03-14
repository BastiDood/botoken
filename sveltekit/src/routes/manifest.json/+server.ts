import type { WebAppManifest } from 'web-app-manifest';
import { json } from '@sveltejs/kit';
import logo32 from '$lib/icons/icons-32.png';
import logo64 from '$lib/icons/icons-64.png';
import logo96 from '$lib/icons/icons-96.png';
import logo144 from '$lib/icons/icons-144.png';
import logo256 from '$lib/icons/icons-256.png';

export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
    return json({
        name: 'Botoken',
        description: 'Botoken is an Ethereum-powered polling system for decentralized autonomous organizations.',
        display: 'standalone',
        start_url: '/',
        icons: [
            { src: logo32, sizes: '32x32', type: 'image/png' },
            { src: logo64, sizes: '64x64', type: 'image/png' },
            { src: logo96, sizes: '96x96', type: 'image/png' },
            { src: logo144, sizes: '128x128', type: 'image/png' },
            { src: logo256, sizes: '256x256', type: 'image/png' },
        ],
    } satisfies WebAppManifest);
}
