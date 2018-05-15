import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import DS from 'ember-data';
import { localClassName, localClassNames } from 'ember-osf-web/decorators/css-modules';
import File from 'ember-osf-web/models/file';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import eatArgs from 'ember-osf-web/utils/eat-args';
import humanFileSize from 'ember-osf-web/utils/human-file-size';
import pathJoin from 'ember-osf-web/utils/path-join';
import moment from 'moment';
import styles from './styles';
import layout from './template';

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
@localClassNames('file-browser-item')
export default class FileBrowserItem extends Component.extend({ styles }) {
    layout = layout;

    @service analytics!: Analytics;
    @service store!: DS.Store;

    item?: File;

    @localClassName
    @computed('item.isSelected')
    get selected(): boolean {
        return !!this.item && this.item.isSelected;
    }

    @computed('item.size')
    get size(): string {
        // TODO: This should be i18n-ized
        return this.item && this.item.size ? humanFileSize(this.item.size, true) : '';
    }

    @computed('item.dateModified')
    get date(): string {
        // TODO: This should be i18n-ized
        return this.item ? moment(this.item.dateModified).format('YYYY-MM-DD h:mm A') : '';
    }

    @computed('item.guid')
    get link(): string {
        return this.item && this.item.guid ? pathJoin(window.location.origin, this.item.guid) : '';
    }

    /**
     * Placeholder for closure action: openItem
     */
    openItem(item: File | undefined, show: string) {
        eatArgs(item, show);
        assert('You should pass in a closure action: openItem');
    }

    /**
     * Placeholder for closure action: selectItem
     */
    selectItem(item: File | undefined) {
        eatArgs(item);
        assert('You should pass in a closure action: selectItem');
    }

    /**
     * Placeholder for closure action: selectMultiple
     */
    selectMultiple(item: File | undefined, metaKey: boolean) {
        eatArgs(item, metaKey);
        assert('You should pass in a closure action: selectMultiple');
    }

    @action
    openVersion() {
        this.openItem(this.item, 'revision');
    }

    @action
    open() {
        this.openItem(this.item, 'view');
    }

    click(event: MouseEvent) {
        const {
            ctrlKey,
            metaKey,
            shiftKey,
            target,
        } = event;

        const modifierKey = defaultTo(metaKey, ctrlKey);

        if (modifierKey && (target as HTMLElement).tagName === 'A') {
            window.open(this.link);
            return;
        }

        if (shiftKey || metaKey) {
            this.selectMultiple(this.item, metaKey);
            return;
        }

        this.selectItem(this.item);
    }
}
