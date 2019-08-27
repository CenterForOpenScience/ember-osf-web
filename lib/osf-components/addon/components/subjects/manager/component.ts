import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
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
}

@tagName('')
@layout(template)
export default class SubjectManagerComponent extends Component.extend({
    initializeSubjects: task(function *(this: SubjectManagerComponent) {
        const { model } = this;
        const savedSubjects = model.isNew ? model.subjects : yield this.model.loadAll('subjects');
        this.setProperties({
            savedSubjects,
            selectedSubjects: [...savedSubjects],
        });
    }).on('didReceiveAttrs').restartable(),

    saveChanges: task(function *(this: SubjectManagerComponent) {
        this.model.set('subjects', this.selectedSubjects);

        try {
            yield this.model.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.registration_metadata.save_subjects_error'));
            throw e;
        }
        this.set('savedSubjects', [...this.selectedSubjects]);
    }).drop(),
}) {
    // required
    model!: ModelWithSubjects;
    provider!: ProviderModel;

    // private
    @service toast!: Toast;
    @service i18n!: I18N;

    savedSubjects: SubjectModel[] = [];
    selectedSubjects: SubjectModel[] = [];

    @alias('save.isRunning')
    isSaving!: boolean;

    @alias('initializeSubjects.isRunning')
    loadingNodeSubjects!: boolean;

    init() {
        super.init();
        assert('@model is required', Boolean(this.model));
        assert('@provider is required', Boolean(this.provider));
    }

    @action
    selectSubject(subject: SubjectModel) {
        assert('Cannot add while saving', !this.isSaving);

        if (!this.selectedSubjects.includes(subject)) {
            this.selectedSubjects.pushObject(subject);

            if (subject.parent) {
                this.selectSubject(subject.parent);
            }
        }
    }

    @action
    unselectSubject(subject: SubjectModel) {
        assert('Cannot remove while saving', !this.isSaving);
        this.selectedSubjects.removeObject(subject);

        const selectedChildren = this.selectedSubjects.filter(s => s.parent === subject);
        selectedChildren.forEach(s => this.unselectSubject(s));
    }

    @action
    discardChanges() {
        assert('Cannot discard changes while saving', !this.isSaving);
        this.set('selectedSubjects', [...this.savedSubjects]);
    }
}
