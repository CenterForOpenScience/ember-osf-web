import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import { RevisionActionTrigger } from 'ember-osf-web/models/revision-action';
import Toast from 'ember-toastr/services/toast';

import RevisionManager from 'registries/edit-revision/revision-manager';

@tagName('')
export default class SubmitAndDecide extends Component {
    @service store!: Store;
    @service toast!: Toast;
    @service intl!: Intl;

    // Required
    revisionManager!: RevisionManager;

    @task
    @waitFor
    async submitAction(actionTrigger: RevisionActionTrigger, comment: string) {
        const revisionAction = this.store.createRecord('revision-action', {
            actionTrigger,
            comment,
            target: this.revisionManager.revision,
        });
        revisionAction.save();
        await this.revisionManager.revision.reload();
    }

    didReceiveAttrs() {
        assert('@revisionManager is required!', Boolean(this.revisionManager));
    }
}
