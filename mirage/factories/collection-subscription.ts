import { association, Factory } from 'ember-cli-mirage';
import CollectionSubscription from 'ember-osf-web/models/collection-subscription';
import { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import faker from 'faker';

export default Factory.extend<CollectionSubscription>({
    eventName: 'new_pending_submissions',
    frequency: faker.random.arrayElement([
        SubscriptionFrequency.Daily,
        SubscriptionFrequency.Instant,
        SubscriptionFrequency.None,
    ]),
    provider: association(),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'collection-subscription': CollectionSubscription;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        collectionSubscriptions: CollectionSubscription;
    } // eslint-disable-line semi
}
