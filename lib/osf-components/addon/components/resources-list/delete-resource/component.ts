import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import { waitFor } from '@ember/test-waiters';

import ResourceModel from 'ember-osf-web/models/resource';

interface Args {
    resource: ResourceModel;
}

export default class DeleteResource extends Component<Args> {
    @service intl!: Intl;
    @service toast!: Toastr;

    @task
    @waitFor
    async deleteResource(resource: ResourceModel) {
        try {
            await resource.destroyRecord();
            this.toast.success('');
        } catch (e) {
            this.toast.error('');
        }
    }
}
