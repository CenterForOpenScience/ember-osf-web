import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';

import { layout } from 'ember-osf-web/decorators/component';
import uniqueId from 'ember-osf-web/utils/unique-id';

import { FilesManager } from 'osf-components/components/files/manager/component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class FilesMenu extends Component {
    filesManager!: FilesManager;
    newFolderDialogIsOpen = false;
    uploadButtonClass = uniqueId(['dz-upload-button']);

    @alias('filesManager.canEdit') canEdit!: boolean;

    @action
    closeDialog() {
        this.set('newFolderDialogIsOpen', false);
    }

    @action
    openDialog(options: { onOpenDialog?: () => void }) {
        const { onOpenDialog } = options;

        this.set('newFolderDialogIsOpen', true);

        if (onOpenDialog) {
            onOpenDialog();
        }
    }
}
