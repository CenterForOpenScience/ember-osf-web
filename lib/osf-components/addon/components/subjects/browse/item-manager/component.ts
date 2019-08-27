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

// ItemManager is responsible for:
// (1) one given subject
// (2) loading/providing that subject's children
// (3) determining whether the given subject has been selected
export interface ItemManager {
    subject?: SubjectModel;

    isSelected: boolean;
    numChildren: number;

    isLoadingChildren: boolean;
    children?: SubjectModel[];

    toggleSelected(): void;
    loadChildren(): void;
}

@tagName('')
@layout(template)
export default class ItemManagerComponent extends Component.extend({
    loadChildren: task(function *(this: ItemManagerComponent) {
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

    @computed('subject', 'subjectsManager.selectedSubjects.[]')
    get isSelected() {
        const {
            subject,
            subjectsManager: {
                selectedSubjects,
            },
        } = this;

        return subject && selectedSubjects && selectedSubjects.includes(subject);
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
        assert('@subjectsManager is required', Boolean(this.subjectsManager));
    }
}
