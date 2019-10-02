import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';
import ProviderModel from 'ember-osf-web/models/provider';
import SubjectModel from 'ember-osf-web/models/subject';

import template from './template';

interface ModelWithSubjects extends OsfModel {
    subjects: SubjectModel[];
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
    provider: ProviderModel;

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
export default class SubjectManagerComponent extends Component.extend({
    initializeSubjects: task(function *(this: SubjectManagerComponent) {
        const { model } = this;
        const savedSubjects: SubjectModel[] = model.isNew ? model.subjects : yield model.loadAll('subjects');
        const savedSubjectIds = new Set(savedSubjects.map(s => s.id));
        this.setProperties({
            savedSubjectIds,
            selectedSubjectIds: new Set(savedSubjectIds),
        });
        this.incrementProperty('selectedSubjectsChanges');
        this.incrementProperty('savedSubjectsChanges');
    }).on('init'),

    saveChanges: task(function *(this: SubjectManagerComponent) {
        const { selectedSubjects } = this;

        try {
            yield this.model.updateM2MRelationship('subjects', selectedSubjects);
        } catch (e) {
            this.toast.error(this.i18n.t('registries.registration_metadata.save_subjects_error'));
            throw e;
        }

        const savedSubjectIds = new Set(selectedSubjects.map(s => s.id));
        this.setProperties({
            savedSubjectIds,
            selectedSubjectIds: new Set(savedSubjectIds),
        });
        this.incrementProperty('selectedSubjectsChanges');
        this.incrementProperty('savedSubjectsChanges');
    }).drop(),
}) {
    // required
    model!: ModelWithSubjects;
    provider!: ProviderModel;

    // private
    @service i18n!: I18N;
    @service toast!: Toast;
    @service store!: DS.Store;

    savedSubjectIds = new Set<string>();
    selectedSubjectIds = new Set<string>();

    // incremented whenever 'savedSubjectIds' and `selectedSubjectIds` are modified.
    // meant for computed properties to depend on, since they can't watch for changes to Sets.
    savedSubjectsChanges: number = 0;
    selectedSubjectsChanges: number = 0;

    @alias('save.isRunning')
    isSaving!: boolean;

    @alias('initializeSubjects.isRunning')
    loadingNodeSubjects!: boolean;

    @computed('savedSubjectsChanges')
    get savedSubjects() {
        return Array.from(this.savedSubjectIds).map(id => {
            const subject = this.store.peekRecord('subject', id);
            assert(`expected subject ${id} is not in the store!`, Boolean(subject));
            return subject!;
        });
    }

    @computed('selectedSubjectsChanges')
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

    init() {
        super.init();

        assert('@model is required', Boolean(this.model));
        assert('@provider is required', Boolean(this.provider));
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
    }

    @action
    discardChanges() {
        assert('Cannot discard changes while saving', !this.isSaving);

        this.set('selectedSubjectIds', new Set(this.savedSubjectIds));
        this.set('selectedSubjectsChanges', 0);
    }
}
