import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias, and } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

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

    // private
    @service i18n!: I18N;
    @service toast!: Toast;

    requestedEditMode: boolean = false;

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;

    @computed('subjectsManager.savedSubjects.length')
    get fieldIsEmpty() {
        return !this.subjectsManager.savedSubjects.length;
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

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
