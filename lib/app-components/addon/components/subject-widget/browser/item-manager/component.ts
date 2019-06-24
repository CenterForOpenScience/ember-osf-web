import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias, bool } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

import { SubjectManager } from 'app-components/components/subject-widget/manager/component';
import { layout } from 'ember-osf-web/decorators/component';
import Subject from 'ember-osf-web/models/subject';

import template from './template';

export interface ItemManager {
    selected: boolean;
    hasChildren: boolean;
    onChange: (subject: Subject) => void;
    toggleChildren: () => void;
    children: Subject[];
    shouldShowChildren: boolean;
    subject: Subject[];
    loading: boolean;
    subjectManager: SubjectManager;
}

@tagName('')
@layout(template)
export default class ItemManagerComponent extends Component.extend({
    getChildren: task(function *(this: ItemManagerComponent, more: boolean = false) {
        const children = yield this.subject.queryHasMany('children', {
            page: more ? this.incrementProperty('page') : 1,
        });
        if (more) {
            this.children.pushObjects(children);
        } else {
            this.setProperties({
                children,
            });
        }
    }).on('didReceiveAttrs').restartable(),
}) {
    subject!: Subject;

    shouldShowChildren: boolean = false;
    children!: Subject[];
    page = 1;

    manager!: SubjectManager;

    @bool('children.length')
    hasChildren!: boolean;

    @alias('getChildren.isRunning')
    loading!: boolean;

    @computed('manager.subjects.[]')
    get selected() {
        return Boolean(this.manager.subjects.findBy('id', this.subject.id));
    }

    @action
    toggleChildren() {
        this.toggleProperty('shouldShowChildren');
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
