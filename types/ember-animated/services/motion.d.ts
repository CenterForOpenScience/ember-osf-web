import Service from '@ember/service';

declare class MotionService extends Service {}

declare module 'ember-animated/services/motion' {
    export = MotionService;
}

declare module '@ember/service' {
    interface Registry {
        '-ea-motion': MotionService;
    }
}
