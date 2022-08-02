import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import { waitFor } from '@ember/test-waiters';

import ResourceModel from 'ember-osf-web/models/resource';

interface Args {
    resource: ResourceModel;
    onDelete: () => void;
}

export default class DeleteResource extends Component<Args> {
    @service intl!: Intl;
    @service toast!: Toastr;

    @task
    @waitFor
    async deleteResource() {
        try {
            await this.args.resource.destroyRecord();
            this.toast.info(this.intl.t('osf-components.resources-list.delete_resource.delete_success'));
            this.args.onDelete();
        } catch (e) {
            this.toast.error(this.intl.t('osf-components.resources-list.delete_resource.delete_failure'));
        }
    }
}
