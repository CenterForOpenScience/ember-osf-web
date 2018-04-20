import { action, computed } from '@ember-decorators/object';
import { notEmpty } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';
import defaultTo from 'ember-osf-web/utils/default-to';
import eatArgs from 'ember-osf-web/utils/eat-args';

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
    items: File[] = defaultTo(this.items, null);
    showFilterClicked: boolean = false;
    filter: string = defaultTo(this.filter, '');
    user: User;

    @notEmpty('filter') showFilterInput;

    @computed('user')
    get edit(): boolean {
        return this.user.id === this.currentUser.currentUserId;
    }

    /**
     * Placeholder for closure action: openFile
     */
    openFile(item: File) {
        eatArgs(item);
        assert('You should pass in a closure action: openFile');
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
