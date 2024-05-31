import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';
import ProviderModel from 'ember-osf-web/models/provider';
import SubjectModel from 'ember-osf-web/models/subject';

import { BufferedChangeset } from 'ember-changeset/types';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { ResourceCollectionDocument } from 'osf-api';
import template from './template';

interface ModelWithSubjects extends OsfModel {
    subjects: SubjectModel[];
    subjectsAcceptable?: SubjectModel[];
}

// SubjectManager is responsible for:
// (1) the subjects saved with the given model instance
// (2) the subjects selected by the user
// (3) updating (1) and (2)
export interface SubjectManager {
    selectedSubjects: SubjectModel[];
    savedSubjects: SubjectModel[];
    isSaving: boolean;
    hasChanged: boolean;
    provider?: ProviderModel;
    model: ModelWithSubjects;

    selectSubject(subject: SubjectModel): void;
    unselectSubject(subject: SubjectModel): void;
    saveChanges(): Promise<void>;
    discardChanges(): void;

    subjectIsSaved(subject: SubjectModel): boolean;
    subjectIsSelected(subject: SubjectModel): boolean;
    subjectHasSelectedChildren(subject: SubjectModel): boolean;
}

@tagName('')
@layout(template)
export default class SubjectManagerComponent extends Component {
    // required
    model!: ModelWithSubjects;
    provider?: ProviderModel;
    doesAutosave!: boolean;

    // optional
    metadataChangeset?: BufferedChangeset;

    // private
    @service intl!: Intl;
    @service toast!: Toast;
    @service store!: Store;

    savedSubjectIds = new Set<string>();
    selectedSubjectIds = new Set<string>();

    // incremented whenever 'savedSubjectIds' and `selectedSubjectIds` are modified.
    // meant for computed properties to depend on, since they can't watch for changes to Sets.
    savedSubjectsChanges = 0;
    selectedSubjectsChanges = 0;

    @alias('save.isRunning')
    isSaving!: boolean;

    @alias('initializeSubjects.isRunning')
    loadingNodeSubjects!: boolean;

    @computed('savedSubjectIds', 'savedSubjectsChanges')
    get savedSubjects() {
        return Array.from(this.savedSubjectIds).map(id => {
            const subject = this.store.peekRecord('subject', id);
            assert(`expected subject ${id} is not in the store!`, Boolean(subject));
            return subject!;
        });
    }

    @computed('selectedSubjectIds', 'selectedSubjectsChanges')
    get selectedSubjects() {
        return Array.from(this.selectedSubjectIds).map(id => {
            const subject = this.store.peekRecord('subject', id);
            assert(`selected subject ${id} is not in the store!`, Boolean(subject));
            return subject!;
        });
    }

    @computed('selectedSubjects.[]')
    get parentIdsWithSelectedChildren() {
        return new Set(
            this.selectedSubjects
                .map(s => s.belongsTo('parent').id())
                .filter(Boolean),
        );
    }

    @task({ on: 'init' })
    @waitFor
    async initializeSubjects() {
        const { model } = this;
        const savedSubjects: SubjectModel[] = model.get('isNew') ? model.subjects : (await model.loadAll('subjects'));
        const savedSubjectIds = new Set(savedSubjects.map(s => s.id));
        this.setProperties({
            savedSubjectIds,
            selectedSubjectIds: new Set(savedSubjectIds),
        });
        this.incrementProperty('selectedSubjectsChanges');
        this.incrementProperty('savedSubjectsChanges');
    }

    @restartableTask
    @waitFor
    async saveChanges() {
        const { selectedSubjects } = this;

        try {
            const updateResult: ResourceCollectionDocument = await this.model.updateM2MRelationship(
                'subjects', selectedSubjects,
            );
            const updatedSubjects = updateResult.data.map(
                datum => this.store.peekRecord(
                    'subject',
                    datum.id,
                ),
            );
            this.model.set('subjects', updatedSubjects);
            if (this.metadataChangeset) {
                this.metadataChangeset.validate('subjects');
            }
        } catch (e) {
            const errorMessage = this.intl.t('registries.registration_metadata.save_subjects_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }

        const savedSubjectIds = new Set(selectedSubjects.map(s => s.id));
        this.setProperties({
            savedSubjectIds,
            selectedSubjectIds: new Set(savedSubjectIds),
        });
        this.incrementProperty('selectedSubjectsChanges');
        this.incrementProperty('savedSubjectsChanges');
    }

    init() {
        super.init();

        assert('@model is required', Boolean(this.model));
        assert('@doesAutosave is required', this.doesAutosave !== null && this.doesAutosave !== undefined);
        const isNodeModel = (this.model && this.model.get('subjects') !== undefined);
        if (!isNodeModel) {
            assert('@provider is required', Boolean(this.provider));
        }
    }

    @action
    subjectIsSelected(subject: SubjectModel) {
        return this.selectedSubjectIds.has(subject.id);
    }

    @action
    subjectIsSaved(subject: SubjectModel) {
        return this.savedSubjectIds.has(subject.id);
    }

    @action
    subjectHasSelectedChildren(subject: SubjectModel) {
        return this.parentIdsWithSelectedChildren.has(subject.id);
    }

    @action
    selectSubject(subject: SubjectModel) {
        assert('Cannot add while saving', !this.isSaving);

        // (1) If a parent (other than root) is already selected, no need to check its parent.
        // (2) Avoid an extra recursive call if current subject is already selected.

        if (!this.selectedSubjectIds.has(subject.id)) {
            this.selectedSubjectIds.add(subject.id);
            this.incrementProperty('selectedSubjectsChanges');

            // assumes the parent is already loaded in the store, which at the moment is true
            if (subject.parent) {
                this.selectSubject(subject.parent);
            }
        }
        if (this.doesAutosave) {
            taskFor(this.saveChanges).perform();
        }
    }

    @action
    unselectSubject(subject: SubjectModel) {
        assert('Cannot remove while saving', !this.isSaving);

        this.selectedSubjectIds.delete(subject.id);
        this.incrementProperty('selectedSubjectsChanges');

        if (this.subjectHasSelectedChildren(subject)) {
            this.selectedSubjects
                .filter(s => s.belongsTo('parent').id() === subject.id)
                .forEach(s => this.unselectSubject(s));
        }
        if (this.doesAutosave) {
            taskFor(this.saveChanges).perform();
        }
    }

    @action
    discardChanges() {
        assert('Cannot discard changes while saving', !this.isSaving);

        this.set('selectedSubjectIds', new Set(this.savedSubjectIds));
        this.set('selectedSubjectsChanges', 0);
    }
}
