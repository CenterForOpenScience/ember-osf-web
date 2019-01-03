import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { localClassName, localClassNames } from 'ember-css-modules';
import DS from 'ember-data';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import pathJoin from 'ember-osf-web/utils/path-join';
import styles from './styles';
import template from './template';

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
@layout(template)
@localClassNames('FileListItem')
export default class FileListItem extends Component.extend({ styles }) {
    @service store!: DS.Store;

    item?: File;
    @requiredAction openItem!: (item: File | undefined) => void;

    @localClassName()
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
