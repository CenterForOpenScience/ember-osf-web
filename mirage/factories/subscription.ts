import { Factory } from 'ember-cli-mirage';
import SubscriptionModel, { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import faker from 'faker';

export interface MirageSubscription extends SubscriptionModel {
    eventName: string;
    frequency: SubscriptionFrequency;
}

export default Factory.extend<MirageSubscription>({
    eventName: 'new_pending_submissions',
    frequency: faker.random.arrayElement([
        SubscriptionFrequency.Daily,
        SubscriptionFrequency.Instant,
        SubscriptionFrequency.None,
    ]),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        subscription: MirageSubscription;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        subscriptions: MirageSubscription;
    } // eslint-disable-line semi
}
