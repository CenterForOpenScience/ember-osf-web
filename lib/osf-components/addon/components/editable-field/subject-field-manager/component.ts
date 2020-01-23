import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { task } from 'ember-concurrency-decorators';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';

import template from './template';

@tagName('')
@layout(template)
export default class SubjectFieldManagerComponent extends Component {
    // required
    node!: Node;
    subjectsManager!: SubjectManager;

    requestedEditMode: boolean = false;

    @alias('node.userHasAdminPermission')
    userCanEdit!: boolean;

    @and('userCanEdit', 'requestedEditMode')
    inEditMode!: boolean;

    @computed('subjectsManager.savedSubjects.length')
    get fieldIsEmpty() {
        return !this.subjectsManager.savedSubjects.length;
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @task({ drop: true })
    save = task(function *(this: SubjectFieldManagerComponent) {
        try {
            yield this.subjectsManager.saveChanges();
        } catch (e) {
            // TODO
            throw e;
        }
        this.set('requestedEditMode', false);
    });

    @action
    startEditing() {
        this.subjectsManager.discardChanges();
        this.set('requestedEditMode', true);
    }

    @action
    cancel() {
        this.subjectsManager.discardChanges();
        this.set('requestedEditMode', false);
    }
}
