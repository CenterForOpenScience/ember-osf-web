import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { Registry as Services } from '@ember/service';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

export default class SearchHelpModal extends Component {
    layout = layout;

    @service router!: Services['router'];
    isOpen: boolean = defaultTo(this.isOpen, false);

    get currentPath() {
        return getOwner(this).lookup('controller:application').currentPath;
    }

    @action
    close(this: SearchHelpModal) {
        this.set('isOpen', false);
    }
}
