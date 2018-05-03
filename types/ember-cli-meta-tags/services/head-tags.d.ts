import { computed } from '@ember/object';
import Service from '@ember/service';

class HeadTags extends Service {
    collectHeadTags(): void;
}

declare module 'ember-cli-meta-tags/services/head-tags' {
    export = HeadTags;
}

declare module '@ember/service' {
    interface Registry {
        'head-tags': HeadTags;
    }
}
