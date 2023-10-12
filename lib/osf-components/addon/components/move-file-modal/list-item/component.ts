import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import config from 'ember-osf-web/config/environment';

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
        const { item, filesToMove } = this.args;
        return filesToMove.findBy('id', item.id);
    }

    get isReadOnlyProvider() {
        let readOnlyProvider = false;
        if (this.args.item.isFolder) {
            const provider = this.args.item as ProviderFile | File;
            readOnlyProvider = !provider.userCanMoveToHere;
        }
        return readOnlyProvider;
    }


    get shouldDisable() {
        const { currentUserIsReadOnly } = this.args.currentNode;
        return this.isBeingMoved || this.isReadOnlyProvider || currentUserIsReadOnly;
    }

    get assetPrefix() {
        return config.assetsPrefix;
    }
}
