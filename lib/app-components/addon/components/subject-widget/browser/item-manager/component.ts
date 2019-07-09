import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias, bool } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { SubjectManager } from 'app-components/components/subject-widget/manager/component';
import { layout } from 'ember-osf-web/decorators/component';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Subject from 'ember-osf-web/models/subject';

import template from './template';

export interface ItemManager {
    selected: boolean;
    hasChildren: boolean;
    onChange: (subject: Subject) => void;
    showMore: () => void;
    toggleChildren: () => void;
    children: Subject[];
    shouldShowChildren: boolean;
    subject: Subject[];
    loading: boolean;
    subjectManager: SubjectManager;
    childrenCount: number;
}

@tagName('')
@layout(template)
export default class ItemManagerComponent extends Component.extend({
    getChildren: task(function *(this: ItemManagerComponent, more: boolean = false) {
        const children = yield this.subject.queryHasMany('children', {
            page: more ? this.incrementProperty('page') : 1,
            related_counts: 'children',
        });
        if (more) {
            this.children.pushObjects(children);
            this.setProperties({ loadingMoreChildren: false });
        } else {
            this.setProperties({
                children,
            });
        }
    }).restartable(),
}) {
    @service store!: DS.Store;
    subject!: Subject;

    shouldShowChildren: boolean = false;
    children!: QueryHasManyResult<Subject>;
    loadingMoreChildren: boolean = false;

    page = 1;

    manager!: SubjectManager;

    childrenCount!: number;

    @bool('childrenCount')
    hasChildren!: boolean;

    @alias('getChildren.isRunning')
    loading!: boolean;

    constructor(properties: object) {
        super(properties);
        if (this.subject) {
            const childrenCount = this.subject.childrenCount || 0;
            this.setProperties({ childrenCount });
        }
    }

    @computed('childrenCount')
    get placeholderCount() {
        const count = this.childrenCount < 10 ? this.childrenCount : 10;
        return count;
    }

    @computed('manager.subjects.[]')
    get selected() {
        if (this.manager.subjects) {
            return Boolean(this.manager.subjects.findBy('id', this.subject.id));
        }
        return undefined;
    }

    @computed('children.[]', 'children.meta.{total,per_page}')
    get hasMore(): boolean | undefined {
        return this.children && (this.children.meta.total > this.children.meta.per_page)
            && (this.children.length < this.children.meta.total);
    }

    @action
    toggleChildren() {
        this.toggleProperty('shouldShowChildren');
        if (this.shouldShowChildren) {
            if (!this.children) {
                this.getChildren.perform();
            }
        }
    }

    @action
    showMore() {
        this.setProperties({ loadingMoreChildren: true });
        this.getChildren.perform(true);
    }

    @action
    onChange(subject: Subject) {
        if (this.selected) {
            this.manager.remove(subject);
        } else {
            this.manager.add(subject);
        }
    }
}
