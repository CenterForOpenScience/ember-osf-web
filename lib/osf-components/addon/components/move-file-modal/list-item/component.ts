import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import NodeModel from 'ember-osf-web/models/node';
import File from 'ember-osf-web/packages/files/file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';

interface ListItemArgs {
    item: ProviderFile | File | NodeModel;
    currentNode: NodeModel;
    filesToMove: File[];
    onNodeSelect: () => void;
    onFolderSelect: () => void;
    isProvider: boolean;
}

export default class ListItemComponent extends Component<ListItemArgs> {
    @service store!: Store;
    @service currentUser!: CurrentUserService;
    @service intl!: Intl;
    @service toast!: Toast;

    get isBeingMoved() {
        return this.args.filesToMove.includes(this.args.item as File);
    }

    get isReadOnlyProvider() {
        let readOnlyProvider = false;
        if (this.args.isProvider && this.args.item.isFolder) {
            const provider = this.args.item as ProviderFile;
            readOnlyProvider = !provider.userCanMoveToHere;
        }
        return readOnlyProvider;
    }


    get shouldDisable() {
        const { currentUserIsReadOnly } = this.args.currentNode;
        return this.isBeingMoved || this.isReadOnlyProvider || currentUserIsReadOnly;
    }

    get destinationSelectHelpText() {
        if (this.args.currentNode && !this.args.currentNode.userHasWritePermission) {
            return this.intl.t('osf-components.move_file_modal.no_write_permission');
        }
        return this.intl.t('osf-components.move_file_modal.select_provider');
    }
}
