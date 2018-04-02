import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import File from 'ember-osf-web/models/file';
import analytics from 'ember-osf-web/services/analytics';
import humanFileSize from 'ember-osf-web/utils/human-file-size';
import pathJoin from 'ember-osf-web/utils/path-join';
import moment from 'moment';

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
    @service analytics;
    @service store;

    item: File;
    selectedItems: File[];

    @computed('selectedItems.[]')
    get selected(this: FileBrowserItem): boolean {
        // TODO: This would be better if selectedItems were a hash. Can Ember
        // observe when properties are added to or removed from an object?
        return this.get('selectedItems').includes(this.get('item'));
    }

    @computed('item.size')
    get size(this: FileBrowserItem): string {
        const size = this.get('item').get('size');
        // TODO: This should be i18n-ized
        return size ? humanFileSize(size, true) : '';
    }

    @computed('item.dateModified')
    get date(this: FileBrowserItem): string {
        const date = this.get('item').get('dateModified');
        // TODO: This should be i18n-ized
        return moment(date).utc().format('YYYY-MM-DD h:mm A');
    }

    @computed('item.guid')
    get link(this: FileBrowserItem): string {
        const guid = this.get('item').get('guid');
        return guid ? pathJoin(window.location.origin, guid) : '';
    }

    @action
    openVersion(this: FileBrowserItem) {
        this.openItem(this.get('item'), 'revision');
    }

    @action
    open(this: FileBrowserItem) {
        this.openItem(this.get('item'), 'view');
    }

    click(this: FileBrowserItem, event: MouseEvent) {
        const {
            ctrlKey,
            metaKey,
            shiftKey,
            target,
        } = event;

        const modifierKey = metaKey || ctrlKey;

        if (modifierKey && (target as HTMLElement).tagName === 'A') {
            window.open(this.get('link'));
            return;
        }

        const item = this.get('item');

        if (shiftKey || metaKey) {
            this.get('selectMultiple')(item, metaKey);
            return;
        }

        this.get('selectItem')(item);
    }
}
