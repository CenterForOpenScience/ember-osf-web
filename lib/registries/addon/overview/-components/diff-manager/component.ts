// take in 1 revision and compare it to the original version (future work to support any base version)
// if there is no selected revisionId, then compare to the latest version
// if there is a selected revisionId, then compare to the selected version

import { inject as service } from '@ember/service';
import Store from "@ember-data/store";
import Component from "@glimmer/component";
import { tracked } from '@glimmer/tracking';
import RegistrationModel from "ember-osf-web/models/registration";
import { waitFor } from "@ember/test-waiters";
import { task } from "ember-concurrency";
import { taskFor } from "ember-concurrency-ts";
import captureException, { getApiErrorMessage } from "ember-osf-web/utils/capture-exception";
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import { action, set } from "@ember/object";
import SchemaResponseModel from "ember-osf-web/models/schema-response";
import { getSchemaBlockGroups } from "ember-osf-web/packages/registration-schema";
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

    constructor(registration: RegistrationModel, headRevisionId?: string, baseRevisionId?: string) {
        super(...args: any[]);
        taskFor(this.loadRevision).perform(registration, headRevisionId, baseRevisionId);
    }

    recalculateDiff() {
        const { registration, headRevisionId, baseRevisionId } = this.args;
        taskFor(this.loadRevision).perform(registration, headRevisionId, baseRevisionId);
    }

    @task
    @waitFor
    async loadRevision(registration: RegistrationModel, headRevisionId: string, baseRevisionId?: string) {
        if (baseRevisionId) {
            this.baseRevision = await this.store.findRecord('schema-response', baseRevisionId);
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
        taskFor(this.getDiff).perform();
    }

    @task
    @waitFor
    async getDiff() {
        if (!this.registration || !this.headRevision || !this.baseRevision) {
            // const errorMessage = this.intl.t('registries.edit_revision.diff.no_registration');
            // captureException(e, {errorMessage});
            assert('getDiff() requires a registration, headRevision, and baseRevision');
            return undefined;
        }


        const newChanges = this.headRevision.revisionResponses;
        const oldChanges = this.baseRevision.revisionResponses;

        Object.entries(newChanges).reduce((acc: string[], entry) => {
            if (entry !== oldChanges[key]) {
                acc.push(key);
            }
        }, []);
        if (baseRevisionId) {
            try {
                
                // get the associated schema block numbers
                    // add a label for updates, deletions
                    let blocks = [];

                    if (revisionUpdates.length > 0) {
                        revisionUpdates.forEach(updatedBlock => {
                            // TODO add in hbs file for each schema block if modified
                            const updatedDiffBlocks = await getSchemaBlockGroups(revisionUpdates);
                            const deletedDiffBlocks = await getSchemaBlockGroups(revisionDeletes);
                            console.log(updatedBlock);
                        })
                    }
            } catch(e) {
                throw new Error();
            } finally {
                console.log('Appliction close.');
            }
        }
    }

        // const newChanges = revisionId ? revision.revisionResponses : registration.registrationResponses;
        // const baseChanges = baseRevisionId ? baseRevision.revisionResponses : originalRevision.revisionResponses;
        // loop through each key/value pair of newChanges and baseChanges, compare values,
        // if the values are different, add the key to the array
        // Object.entries(newChanges).reduce((key, value) => { // goes through each key value pair
        //     if (value !== baseChanges[key]) {
        //         return key;
        //     }
        // }, [])
        // taskFor(this.updateSchemaLabel).perform()
