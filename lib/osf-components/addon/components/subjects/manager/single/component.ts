import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { dropTask } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import { layout } from 'ember-osf-web/decorators/component';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import SubjectModel from 'ember-osf-web/models/subject';
import Analytics from 'ember-osf-web/services/analytics';
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
    isLoaded: boolean;
    hasSelectedChildren: boolean;

    numChildren: number;
    children?: SubjectModel[];

    ChildSubjectManager: unknown; // contextual component

    toggleSelected(): void;
    ensureChildrenLoaded(): void;
}

@tagName('')
@layout(template)
export default class SingleSubjectManagerComponent extends Component {
    // required
    subjectsManager!: SubjectManager;

    // optional
    subject?: SubjectModel;

    // private
    @service analytics!: Analytics;
    @service store!: Store;

    children?: QueryHasManyResult<SubjectModel>;

    @alias('loadChildren.isRunning')
    isLoading!: boolean;

    @alias('subject.relatedCounts.children')
    numChildren?: number;

    @computed('subject', 'numChildren')
    get isLoaded(): boolean {
        return typeof this.subject !== 'undefined';
    }

    @computed('isLoaded', 'numChildren')
    get hasChildren() {
        return this.isLoaded && Boolean(this.numChildren);
    }

    @computed('subject', 'subjectsManager.selectedSubjectsChanges')
    get hasSelectedChildren() {
        const {
            subject,
            subjectsManager,
        } = this;
        return Boolean(subject && subjectsManager.subjectHasSelectedChildren(subject));
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

    @dropTask
    @waitFor
    async loadChildren() {
        const { subject } = this;
        if (subject) {
            const children = await subject.queryHasMany('children', {
                page: {
                    size: 150, // TODO: import const
                },
                related_counts: 'children',
            });
            this.setProperties({ children });
        }
    }

    @action
    ensureChildrenLoaded() {
        if (!this.children && !this.isLoading) {
            taskFor(this.loadChildren).perform();
        }
    }

    @action
    toggleSelected(event: Event) {
        const { subject } = this;

        if (!subject) {
            return;
        }

        const target = event.currentTarget as Element;

        if (this.isSelected) {
            this.analytics.trackFromElement(target, {
                name: 'Remove',
                category: 'subject',
                action: 'select',
                extra: subject.text,
            });
            this.subjectsManager.unselectSubject(subject);
        } else {
            this.analytics.trackFromElement(target, {
                name: 'Add',
                category: 'subject',
                action: 'select',
                extra: subject.text,
            });
            this.subjectsManager.selectSubject(subject);
        }
    }

    init() {
        super.init();
        assert('@subjectsManager is required', Boolean(this.subjectsManager));
    }
}
