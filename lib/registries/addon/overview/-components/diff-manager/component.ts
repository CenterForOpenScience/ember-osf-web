import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import RegistrationModel from 'ember-osf-web/models/registration';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';

interface Args {
    registration: RegistrationModel;
    headRevisionId?: string;
    baseRevisionId?: string;
}

export default class DiffManager extends Component<Args> {
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
            this.baseRevision = registration.schemaResponses.firstObject;
        }
        if (headRevisionId) {
            const headRevision = this.store.peekRecord('schema-response', headRevisionId);
            if (!headRevision) {
                this.headRevision = await this.store.findRecord('schema-response', headRevisionId);
            }
        } else {
            this.headRevision = registration.schemaResponses.lastObject;
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
