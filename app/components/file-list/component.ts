import { action, computed } from '@ember-decorators/object';
import { alias, filterBy, not, notEmpty } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
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
    @service store;
    @service toast;

    unselect = true;
    openOnSelect = false;
    isLoadingProjects = null;
    selectedFile = null;
    node: Node | null = null;
    loaded = true;
    uploading = A();

    popupOpen = false;
    itemsLoaded = true;

    items: File[] = this.items || null;

    showFilterClicked: boolean = false;
    filter: string = this.filter || '';

    user: User;

    @not('items') loading;
    @alias('node.links.html') nodeLink;
    @filterBy('items', 'isSelected', true) selectedItems;
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
