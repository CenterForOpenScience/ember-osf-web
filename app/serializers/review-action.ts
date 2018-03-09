import OsfSerializer from './osf-serializer';

export default class ReviewAction extends OsfSerializer {
    // Because `trigger` is a private method on DS.Model
    attrs: {actionTrigger: string} = {
        actionTrigger: 'trigger',
    };
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'review-action': ReviewAction;
    }
}
