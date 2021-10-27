// take in 1 revision and compare it to the original version (future work to support any base version)
// if there is no selected revisionId, then compare to the latest version
// if there is a selected revisionId, then compare to the selected version

import Store from "@ember-data/store";
import RegistrationModel from "ember-osf-web/models/registration";
import { inject as service } from '@ember/service';
import { waitFor } from "@ember/test-waiters";
import { task } from "ember-concurrency";
import RevisionManager from "registries/edit-revision/revision-manager";
import { taskFor } from "ember-concurrency-ts";
import captureException, { getApiErrorMessage } from "ember-osf-web/utils/capture-exception";
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import { set } from "@ember/object";
import SchemaResponseModel from "ember-osf-web/models/schema-response";
import { getSchemaBlockGroups } from "ember-osf-web/packages/registration-schema";
import { assert } from '@ember/debug';

// takes in a revisionId (and a base version)
// outputs a list of changed response Ids
export default class DiffManager {
    revisionManager!: RevisionManager;
    // fetch registration
    registration!: RegistrationModel;
    revision?: SchemaResponseModel;

    @service store!: Store;
    @service intl!: Intl;
    @service toast!: Toast;

    // onInit: fetch original revision
    // onInit: check if we are given a revisionId, if so, fetch that revision, if not, compare to responses on registration
    // onInit: check if we are given a base version, if so, compare to that version, if not, compare to original responses
    constructor(revisionId: string, baseRevisionId: string) {
        // set the revision based off of the id
        set(this, 'revision', revisionId);
        set(this, 'revision', baseRevisionId);
        taskFor(this.getDiff).perform();
    }

    @task
    @waitFor
    async getDiff() {
        const revisionId = this.revisionManager.revisionId;
        let baseRevisionId =  this.revisionManager.baseRevisionId;
        if (!this.registration) {
            const errorMessage = this.intl.t('registries.edit_revision.diff.no_registration');
            captureException(e, {errorMessage});
            return undefined;
            assert('getDiff() requires a registration');
        }
        if (!revisionId) {
            const errorMessage = this.intl.t('registries.edit_revision.diff.no_revision');
            captureException(e, {errorMessage});
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }
        // fetch revisions 
        const revisions = await this.registration.queryHasMany('schemaResponses', { 
            revisionJustification,
            isOriginalResponse,
            updatedResponseKeys,
        });
        
        if (!baseRevisionId) {
            baseRevisionId = revisions[0].id; // original revisionId
            console.log('There is no base revision selected, diff is against original version.');
        }
        if (baseRevisionId) {
            try {
                // fetch revision, base revision
                let revisionResponseKeys: string = this.store.peekAll('updatedResponseKeys').findBy('revisionId', revisionId);
                let baseRevisionResponseKeys: string = this.store.peekAll('updatedResponseKeys').findBy('revisionId', baseRevisionId);
                if (revisionResponseKeys == null){
                    console.log('No updates are available for this revision.');
                }

                let revisionDeletes : string[] = [];
                let revisionUpdates : string[] = [];
                // compare to original responses
                if (revisionResponseKeys && baseRevisionResponseKeys) {
                    for (var i = 0; i < revisionResponseKeys.length; i++) {
                        // get deletions 'content removed' -> option to view justification reason
                        if (baseRevisionResponseKeys.indexOf(revisionResponseKeys[i]) === -1) {
                            revisionDeletes.push(revisionResponseKeys[i]);
                        }
                        // get updates
                        if (revisionResponseKeys.indexOf(baseRevisionResponseKeys[i]) === -1) {
                            revisionUpdates.push(baseRevisionResponseKeys);
                        }
                        return [revisionDeletes, revisionUpdates];
                    }
                }

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
