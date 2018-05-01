declare module 'ember-asset-loader/test-support/preload-assets' {
    import RSVP from 'rsvp';

    export default function preloadAssets(manifest: any): RSVP.Promise;
}
