import { action, computed } from '@ember-decorators/object';
import { notEmpty } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import requiredAction from 'ember-osf-web/decorators/required-action';
import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

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
@localClassNames('FileList')
export default class FileList extends Component {
    layout = layout;
    styles = styles;

    @service currentUser!: CurrentUser;
    @service i18n!: I18N;

    node: Node | null = null;
    items: File[] = defaultTo(this.items, []);
    showFilterClicked: boolean = false;
    filter: string = defaultTo(this.filter, '');
    user?: User;
    @requiredAction openFile!: (item: File) => void;

    @notEmpty('filter') showFilterInput!: boolean;

    @computed('user')
    get edit(): boolean {
        return !!this.user && this.user.id === this.currentUser.currentUserId;
    }

    @action
    closeFilter(this: FileList) {
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
