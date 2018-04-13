import { action, computed } from '@ember-decorators/object';
import { notEmpty } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';

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
export default class FileList extends Component {
    @service currentUser;
    @service i18n;

    node: Node | null = null;
    items: File[] = this.items || null;
    showFilterClicked: boolean = false;
    filter: string = this.filter || '';
    user: User;

    @notEmpty('filter') showFilterInput;

    @computed('user')
    get edit(this: FileList): boolean {
        return this.get('user.id') === this.get('currentUser').get('currentUserId');
    }

    @action
    closeFilter(this: FileList) {
        this.setProperties({
            showFilterClicked: false,
            filter: '',
        });
    }

    @action
    openItem(this: FileList, item, qparams) {
        this.openFile(item, qparams);
    }
}
