import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import RouterService from '@ember/routing/router-service';

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
    @service router!: RouterService;

    @tracked baseRevision: SchemaResponseModel | undefined;
    @tracked headRevision: SchemaResponseModel | undefined;
    @tracked updatedKeys: string[] = [];

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.loadRevision).perform(args.registration, args.headRevisionId, args.baseRevisionId);
    }

    @action
    recalculateDiff() {
        const { registration, headRevisionId, baseRevisionId } = this.args;
        taskFor(this.loadRevision).perform(registration, headRevisionId, baseRevisionId);
    }

    @task
    @waitFor
    async loadRevision(registration: RegistrationModel, headRevisionId?: string, baseRevisionId?: string) {
        if (baseRevisionId) {
            let baseRevision = this.store.peekRecord('schema-response', baseRevisionId);
            if (!baseRevision) {
                baseRevision = await this.store.findRecord('schema-response', baseRevisionId);
            }
            this.baseRevision = baseRevision;
        } else {
            this.baseRevision = await registration.originalResponse;
        }
        const revisions = await registration.queryHasMany('schemaResponses');
        if (headRevisionId) {
            let headRevision = this.store.peekRecord('schema-response', headRevisionId);
            if (!headRevision) {
                headRevision = await this.store.findRecord('schema-response', headRevisionId);
            }
            this.headRevision = headRevision;
        } else {
            this.headRevision = revisions.firstObject;
        }
        this.getDiff();
    }

    getDiff() {
        assert('getDiff() requires a registration', this.args.registration);
        assert('getDiff() requires a headRevision', this.headRevision);
        assert('getDiff() requires a baseRevision', this.baseRevision);

        if (this.headRevision === this.baseRevision) {
            this.updatedKeys = [];
            return;
        }

        const newChanges = this.headRevision.revisionResponses;
        const previousChanges = this.baseRevision.revisionResponses;
        this.updatedKeys = Object.entries(newChanges).reduce((updatedKeys: string[], [key, value]) => {
            if (Array.isArray(value)) {
                if (value.length !== previousChanges[key]?.length) {
                    updatedKeys.push(key);
                } else {
                    for (let i = 0; i < value.length; i++) {
                        if (value[i] !== previousChanges[key]![i]) {
                            updatedKeys.push(key);
                        }
                    }
                }
                return updatedKeys;
            }
            if (value !== previousChanges[key]) {
                updatedKeys.push(key);
            }
            return updatedKeys;
        }, []);
    }
}
