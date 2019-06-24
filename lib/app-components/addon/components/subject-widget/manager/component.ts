import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

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
        const subjects: SubjectModel[] = yield this.model.loadAll('subjects');
        this.setProperties({
            subjects,
            initialSubjects: [...subjects],
        });
    }).on('didReceiveAttrs').restartable(),
    querySubjects: task(function *(this: SubjectManagerComponent, text: string) {
        // return yield this.provider.queryHasMany('subjects', {
        //     filter: {
        //         text,
        //     },
        // });

        const queryResults: QueryHasManyResult<SubjectModel> = yield this.provider.queryHasMany('subjects', {
            filter: {
                text,
            },
        });

        this.setProperties({ queryResults });

        return queryResults;
    }).restartable(),
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
        });

        this.setProperties({ rootSubjects: queryResults });
    }).on('init'),
    save: task(function *(this: SubjectManagerComponent) {
        this.model.set('subjects', this.subjects);

        yield this.model.save();

        this.setProperties({
            initialSubjects: [...this.subjects],
            hasChanged: false,
        });
    }).drop(),
}) {
    // Required
    model!: ModelWithSubjects;

    // Private
    initialSubjects?: SubjectModel[];
    subjects: SubjectModel[] = [];
    hasChanged: boolean = false; // TODO sort subjects, hasChanged -> CP comparing them
    provider!: Provider;
    queryResults!: QueryHasManyResult<SubjectModel>;
    rootSubjects!: QueryHasManyResult<SubjectModel>;
    editMode: boolean = defaultTo(this.editMode, false);
    selectedSubject!: SubjectModel;

    @alias('save.isRunning')
    isSaving!: boolean;

    @alias('querySubjects.isRunning')
    loadingRootSubjects!: boolean;

    @alias('initializeSubjects.isRunning')
    loadingNodeSubjects!: boolean;

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
    discardChanges() {
        assert('Cannot discard changes while saving', !this.isSaving);
        this.setProperties({
            subjects: this.initialSubjects,
            hasChanged: false,
        });
    }
}
