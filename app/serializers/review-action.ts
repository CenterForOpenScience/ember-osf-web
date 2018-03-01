import OsfSerializer from './osf-serializer';

export default class ReviewAction extends OsfSerializer {
    // Because `trigger` is a private method on DS.Model
    attrs = {
        actionTrigger: 'trigger',
    };
    // Serialize `target` relationship
    relationshipTypes = {
        target: 'preprints',
    };
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data' {
    interface SerializerRegistry {
        'review-action': ReviewAction;
    }
}
