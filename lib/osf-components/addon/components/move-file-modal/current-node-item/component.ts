import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import NodeModel from 'ember-osf-web/models/node';
import File from 'ember-osf-web/packages/files/file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';

interface CurrentNodeItemArgs {
    node: NodeModel;
    currentFolder: ProviderFile | File;
    onNodeSelect: () => void;
}

export default class CurrentNodeItemComponent extends Component<CurrentNodeItemArgs> {
    @service store!: Store;
    @service currentUser!: CurrentUserService;
    @service intl!: Intl;
    @service toast!: Toast;

    get destinationSelectHelpText() {
        if (this.args.node && !this.args.node.userHasWritePermission) {
            return this.intl.t('osf-components.move_file_modal.no_write_permission');
        }
        return this.intl.t('osf-components.move_file_modal.select_provider');
    }
}
