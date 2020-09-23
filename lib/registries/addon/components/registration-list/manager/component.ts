import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import RegistrationModel from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';

export default class RegistrationListManager extends Component {
    @service store!: DS.Store;

    provider!: RegistrationProviderModel;
    registrations?: RegistrationModel[];
    filterState: string = 'pending';

    @task({ withTestWaiter: true, drop: true, on: 'didReceiveAttrs' })
    fetchRegistrationss = task(function *(this: RegistrationListManager) {
        const registrations = yield this.provider.queryHasMany('registrations',
            { filter: { machine_state: this.filterState } });
        this.set('registrations', registrations);
    });
}
