import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { localClassNames } from 'ember-css-modules';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';
import styles from './styles';
import template from './template';

// TODO: Improve documentation in the future
/**
 * File browser widget
 *
 * Sample usage:
 * ```handlebars
 * {{file-browser
 * }}
 * ```
 * @class file-browser
 */
@layout(template, styles)
@localClassNames('FileList')
export default class FileList extends Component {
    @service currentUser!: CurrentUser;

    node: Node | null = null;
    items: File[] = [];
    showFilterClicked: boolean = false;
    filter: string = '';
    user?: User;
    @requiredAction openFile!: (item: File) => void;

    @notEmpty('filter') showFilterInput!: boolean;

    @computed('currentUser.currentUserId', 'user.id')
    get edit(): boolean {
        return !!this.user && this.user.id === this.currentUser.currentUserId;
    }

    @action
    closeFilter() {
        this.setProperties({
            showFilterClicked: false,
            filter: '',
        });
    }

    @action
    openItem(item: File) {
        this.openFile(item);
    }
}
