import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias, and } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel, { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Provider from 'ember-osf-web/models/provider';
import SubjectModel from 'ember-osf-web/models/subject';
import defaultTo from 'ember-osf-web/utils/default-to';

import template from './template';

interface ModelWithSubjects extends OsfModel {
    subjects: DS.PromiseManyArray<SubjectModel>;
    provider: Provider;
}

export interface SubjectManager {
    subjects: SubjectModel[];
    initialSubjects: SubjectModel[];
    add: (subject: SubjectModel) => void;
    remove: (subject: SubjectModel) => void;
    discardChanges: () => void;
    save: () => void;
    isSaving: boolean;
    hasChanged: boolean;
    provider: Provider;
    loadingRootSubjects: boolean;
    loadingNodeSubjects: boolean;
    editMode: boolean;
}

@tagName('')
@layout(template)
export default class SubjectManagerComponent extends Component.extend({
    initializeSubjects: task(function *(this: SubjectManagerComponent) {
        if (this.model.isNew) {
            this.setProperties({ subjects: [] as SubjectModel[] });
        } else {
            const subjects: SubjectModel[] = yield this.model.loadAll('subjects');
            this.setProperties({
                subjects,
                initialSubjects: [...subjects],
            });
        }
    }).on('didReceiveAttrs').restartable(),
    getRootSubjects: task(function *(this: SubjectManagerComponent, parent: string = 'null') {
        if (!this.provider) {
            this.setProperties({
                provider: yield this.model.provider,
            });
        }

        const queryResults: QueryHasManyResult<SubjectModel> = yield this.provider.queryHasMany('subjects', {
            filter: {
                parent,
            },
            page: {
                size: 150, // Law category has 117 (Jan 2018)
            },
            related_counts: 'children',
        });

        this.setProperties({ rootSubjects: queryResults });
    }).on('init'),
    save: task(function *(this: SubjectManagerComponent, onSave?: () => void) {
        this.model.set('subjects', this.subjects);

        if (onSave) {
            return onSave();
        }

        try {
            yield this.model.save();

            this.setProperties({
                initialSubjects: [...this.subjects],
                hasChanged: false,
            });
            this.set('requestedEditMode', false);
        } catch (e) {
            this.toast.error(this.i18n.t('registries.registration_metadata.save_subjects_error'));
            throw e;
        }
    }).drop(),
}) {
    // Required
    model!: ModelWithSubjects;

    // Private
    @service toast!: Toast;
    @service i18n!: I18N;

    initialSubjects!: SubjectModel[];
    subjects!: SubjectModel[];
    hasChanged: boolean = false; // TODO sort subjects, hasChanged -> CP comparing them
    provider: Provider = this.provider;
    queryResults!: QueryHasManyResult<SubjectModel>;
    rootSubjects!: QueryHasManyResult<SubjectModel>;
    editMode: boolean = defaultTo(this.editMode, false);
    selectedSubject!: SubjectModel;
    requestedEditMode: boolean = false;

    @alias('model.userHasAdminPermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;

    @alias('save.isRunning')
    isSaving!: boolean;

    @alias('getRootSubjects.isRunning')
    loadingRootSubjects!: boolean;

    @alias('initializeSubjects.isRunning')
    loadingNodeSubjects!: boolean;

    @computed('initialSubjects.[]')
    get fieldIsEmpty() {
        return !(this.initialSubjects || []).length;
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @action
    startEditing() {
        this.setProperties({
            requestedEditMode: true,
        });
    }

    @action
    selectSubject(subject: SubjectModel) {
        this.setProperties({ selectedSubject: subject });
    }

    @action
    add(subject: SubjectModel) {
        assert('Cannot add while saving', !this.isSaving);
        // TODO dedup?
        this.subjects.pushObject(subject);
        this.set('hasChanged', true);
    }

    @action
    remove(subject: SubjectModel) {
        assert('Cannot remove while saving', !this.isSaving);
        this.subjects.removeObject(subject);
        this.set('hasChanged', true);
    }

    @action
    cancel() {
        assert('Cannot discard changes while saving', !this.isSaving);
        this.setProperties({
            subjects: [...this.initialSubjects],
            hasChanged: false,
            requestedEditMode: false,
        });
    }
}
