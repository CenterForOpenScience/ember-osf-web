import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import SubjectModel from 'ember-osf-web/models/subject';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';

import template from './template';

// SingleSubjectManager is responsible for:
// (1) one given subject
// (2) loading/providing that subject's children
// (3) determining whether the given subject has been selected
export interface SingleSubjectManager {
    subject?: SubjectModel;
    isSelected: boolean;
    isSaved: boolean;
    hasSelectedChild: boolean;

    numChildren: number;
    isLoadingChildren: boolean;
    children?: SubjectModel[];

    ChildSubjectManager: unknown; // contextual component

    toggleSelected(): void;
    loadChildren(): void;
}

@tagName('')
@layout(template)
export default class SingleSubjectManagerComponent extends Component.extend({
    loadChildren: task(function *(this: SingleSubjectManagerComponent) {
        const { subject } = this;
        if (subject) {
            const children = yield subject.queryHasMany('children', {
                page: {
                    size: 150, // TODO: import const
                },
                related_counts: 'children',
            });
            this.setProperties({ children });
        }
    }).drop(),
}) {
    // required
    subjectsManager!: SubjectManager;

    // optional
    subject?: SubjectModel;

    // private
    @service store!: DS.Store;

    children?: QueryHasManyResult<SubjectModel>;

    @alias('loadChildren.isRunning')
    isLoading!: boolean;

    @alias('subject.relatedCounts.children')
    numChildren?: number;

    @computed('isPlaceholder', 'numChildren')
    get hasChildren() {
        return !this.isPlaceholder && Boolean(this.numChildren);
    }

    @computed('subject', 'subjectsManager.selectedSubjectsChanges')
    get hasSelectedChild() {
        const {
            subject,
            subjectsManager,
        } = this;
        return Boolean(subject && subjectsManager.subjectHasSelectedChild(subject));
    }

    @computed('subject', 'subjectsManager.selectedSubjectsChanges')
    get isSelected() {
        const {
            subject,
            subjectsManager,
        } = this;
        return Boolean(subject && subjectsManager.subjectIsSelected(subject));
    }

    @computed('subject', 'subjectsManager.savedSubjectsChanges')
    get isSaved() {
        const {
            subject,
            subjectsManager,
        } = this;
        return Boolean(subject && subjectsManager.subjectIsSaved(subject));
    }

    @computed('subject')
    get isPlaceholder(): boolean {
        return typeof this.subject === 'undefined';
    }

    @action
    toggleSelected() {
        const { subject } = this;
        if (!subject) {
            return;
        }

        if (this.isSelected) {
            this.subjectsManager.unselectSubject(subject);
        } else {
            this.subjectsManager.selectSubject(subject);
        }
    }

    init() {
        super.init();
        assert('@subjectsManager is required', Boolean(this.subjectsManager));
    }
}
