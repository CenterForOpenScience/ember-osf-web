import { Factory } from 'ember-cli-mirage';
import RegistrationSubscription from 'ember-osf-web/models/registration-subscription';
import { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import faker from 'faker';

export default Factory.extend<RegistrationSubscription>({
    eventName: 'new_pending_submissions',
    frequency: faker.random.arrayElement([
        SubscriptionFrequency.Daily,
        SubscriptionFrequency.Instant,
        SubscriptionFrequency.None,
    ]),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'registration-subscription': RegistrationSubscription;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        registrationSubscriptions: RegistrationSubscription;
    } // eslint-disable-line semi
}
