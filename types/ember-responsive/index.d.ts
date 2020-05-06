import Service from '@ember/service';

declare class Media extends Service {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isJumbo: boolean;
}

declare module 'ember-responsive' {
    export default Media;
}

declare module '@ember/service' {
    interface Registry {
        media: Media;
    }
}
