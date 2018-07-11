import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import DS from 'ember-data';
import { localClassName, localClassNames } from 'ember-osf-web/decorators/css-modules';
import File from 'ember-osf-web/models/file';
import eatArgs from 'ember-osf-web/utils/eat-args';
import pathJoin from 'ember-osf-web/utils/path-join';
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
 * {{file-list-item
 *    file=file
 *    selectItem=(action 'selectItem') - Action handling clicking on the body of the row
 *    openItem=(action 'openItem') - Action handling clicking the link-name of the file
 * }}
 * ```
 * @class file-icon
 */
@localClassNames('FileListItem')
export default class FileListItem extends Component.extend({ styles }) {
    layout = layout;

    @service store!: DS.Store;

    item?: File;

    /**
     * Placeholder for closure action: openItem
     */
    openItem(item: File | undefined) {
        eatArgs(item);
        assert('You should pass in a closure action: openItem');
    }

    @localClassName
    @computed('item.isSelected')
    get selected(): boolean {
        return !!this.item && this.item.isSelected;
    }

    @computed('item.guid')
    get link(): string {
        return this.item && this.item.guid ? pathJoin(window.location.origin, this.item.guid) : '';
    }

    @action
    open(ev?: Event) {
        if (ev) {
            ev.stopPropagation();
        }
        this.openItem(this.item);
    }
}
