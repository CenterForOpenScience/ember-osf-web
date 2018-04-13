import OsfSerializer from './osf-serializer';

export default class ReviewAction extends OsfSerializer {
    // Because `trigger` is a private method on DS.Modelq
    attrs = {
        ...this.attrs,
        actionTrigger: 'trigger',
    };
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'review-action': ReviewAction;
    }
}
