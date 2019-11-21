import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import { FilesManager } from 'osf-components/components/files/manager/component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class FilesMenu extends Component {
    filesManager!: FilesManager;
    newFolderDialogIsOpen = false;

    @alias('filesManager.canEdit') canEdit!: boolean;

    @action
    closeDialog() {
        this.set('newFolderDialogIsOpen', false);
    }

    @action
    openDialog() {
        this.set('newFolderDialogIsOpen', true);
    }
}
