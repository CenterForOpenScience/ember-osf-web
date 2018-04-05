import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import File from 'ember-osf-web/models/file';
import pathJoin from 'ember-osf-web/utils/path-join';

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * Display one row of item, with its information.
 *
 * Sample usage:
 * ```handlebars
 * {{file-browser-item
 *    file=file
 *    selectItem=(action 'selectItem') - Action handling clicking on the body of the row
 *    openItem=(action 'openItem') - Action handling clicking the link-name of the file
 *    selectMultiple=(action 'selectMultiple') - Action handling clicking multiple rows, through cmd/ctrl and/or shift
 *    display=display Array[Strings] - Indicating which rows of information to display
 *    nameColumnWidth=nameColumnWidth String of number - How wide is the main collumn (name)
 * }}
 * ```
 * @class file-icon
 */
export default class FileBrowserItem extends Component {
    @service store;

    item: File;
    openItem = this.openItem;

    @computed('item.guid')
    get link(this: FileBrowserItem): string {
        const guid = this.get('item').get('guid');
        return guid ? pathJoin(window.location.origin, guid) : '';
    }

    @action
    open(this: FileBrowserItem) {
        this.openItem(this.get('item'), 'view');
    }
}
