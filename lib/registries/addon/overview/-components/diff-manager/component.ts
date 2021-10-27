// take in 1 revision and compare it to the original version (future work to support any base version)
// if there is no selected revisionId, then compare to the latest version
// if there is a selected revisionId, then compare to the selected version

import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import RegistrationModel from 'ember-osf-web/models/registration';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import { assert } from '@ember/debug';

// takes in a revisionId (and a base version)
// outputs a list of changed response Ids

interface Args {
    registration: RegistrationModel;
    headRevisionId?: string;
    baseRevisionId?: string;
}

export default class DiffManager extends Component<Args> {
    // fetch registration
    registration!: RegistrationModel;
    revision?: SchemaResponseModel;

    @service store!: Store;
    @service intl!: Intl;
    @service toast!: Toast;

    @tracked baseRevision: SchemaResponseModel | undefined;
    @tracked headRevision: SchemaResponseModel | undefined;
    @tracked updatedKeys: string[] = [];

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.loadRevision).perform(args.registration, args.headRevisionId, args.baseRevisionId);
    }

    recalculateDiff() {
        const { registration, headRevisionId, baseRevisionId } = this.args;
        taskFor(this.loadRevision).perform(registration, headRevisionId, baseRevisionId);
    }

    @task
    @waitFor
    async loadRevision(registration: RegistrationModel, headRevisionId?: string, baseRevisionId?: string) {
        if (baseRevisionId) {
            const baseRevision = this.store.peekRecord('schema-response', baseRevisionId);
            if (!baseRevision) {
                this.baseRevision = await this.store.findRecord('schema-response', baseRevisionId);
            }
        } else {
            this.baseRevision = await registration.schemaResponses.firstObject;
        }
        if (headRevisionId) {
            const headRevision = this.store.peekRecord('schema-response', headRevisionId);
            if (!headRevision) {
                this.headRevision = await this.store.findRecord('schema-response', headRevisionId);
            }
        } else {
            this.headRevision = await registration.schemaResponses.lastObject;
        }
        this.getDiff();
    }

    getDiff() {
        assert('getDiff() requires a registration, headRevision, and baseRevision',
            this.args.registration && this.headRevision && this.baseRevision);

        const newChanges = this.headRevision.revisionResponses;
        const previousChanges = this.baseRevision.revisionResponses;
        this.updatedKeys = Object.entries(newChanges).reduce((updatedKeys: string[], [key, value]) => {
            if (value !== previousChanges[key]) {
                updatedKeys.push(key);
            }
            return updatedKeys;
        }, []);
    }
}
