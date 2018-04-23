import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Node from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';

export default class NewProjectModal extends Component {
    @service analytics;

    more: boolean = defaultTo(this.more, false);
    newNode?: Node;
    nodeTitle?: null;
    styleNamespace?: string;

    @computed('styleNamespace')
    get modalClass(): string {
        return `${this.styleNamespace}__modal`;
    }

    @action
    toggle(property) {
        this.toggleProperty(property);
    }
}
