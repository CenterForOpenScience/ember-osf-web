import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

export default class NewProjectModal extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    more: boolean = defaultTo(this.more, false);
    newNode?: Node;
    nodeTitle?: null;
    styleNamespace?: string;

    @computed('styleNamespace')
    get modalClass(): string {
        return `${this.styleNamespace}__modal`;
    }

    @action
    toggle(property: keyof this) {
        this.toggleProperty(property);
    }
}
