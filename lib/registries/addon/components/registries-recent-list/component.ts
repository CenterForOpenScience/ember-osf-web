import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Store from 'ember-data/store';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import { ShareRegistration } from 'registries/services/share-search';
import layout from './template';

@localClassNames('RecentList')
export default class RegistriesRecentList extends Component {
    static positionalParams = ['items'];

    layout = layout;

    @service analytics!: Analytics;
    @service store!: Store;

    items!: ShareRegistration[];

    @computed('items')
    get registrations() {
        const schemaLookup = this.store.peekAll('registration-schema').reduce(
            (acc, schema) => ({ ...acc, [schema.name]: schema }),
            { } as { [key: string]: RegistrationSchema },
        );

        return this.items.map(item => {
            let registrationURL = item.mainLink;

            if (!registrationURL.endsWith('/')) {
                registrationURL += '/';
            }

            if (schemaLookup[item.registrationType]) {
                registrationURL += `register/${schemaLookup[item.registrationType].id}`;
            }

            return { ...item, registrationURL };
        });
    }
}
