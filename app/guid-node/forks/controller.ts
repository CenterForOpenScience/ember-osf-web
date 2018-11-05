import { action, computed } from '@ember-decorators/object';
import { readOnly } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Analytics from 'ember-osf-web/services/analytics';

import I18N from 'ember-i18n/services/i18n';
import Node from 'ember-osf-web/models/node';
import StatusMessages from 'ember-osf-web/services/status-messages';
import Toast from 'ember-toastr/services/toast';

export default class GuidNodeForks extends Controller {
    @service toast!: Toast;
    @service i18n!: I18N;
    @service statusMessages!: StatusMessages;
    @service analytics!: Analytics;

    loadingNew = false;
    newModal = false;

    reloadList?: (page?: number) => void; // bound by paginated-list

    forksQueryParams = { embed: 'contributors' };

    @readOnly('model.taskInstance.value')
    node?: Node;

    @computed('node')
    get nodeType(this: GuidNodeForks) {
        if (!this.node) {
            return;
        }
        return this.node.parent ? 'component' : 'project';
    }

    @action
    newFork(this: GuidNodeForks) {
        this.analytics.click('button', 'Project Forks - Create Fork');
        this.set('newModal', false);
        this.set('loadingNew', true);
        this.node!.makeFork().then(() => {
            this.set('loadingNew', false);
            const message = this.i18n.t('forks.new_fork_info');
            const title = this.i18n.t('forks.new_fork_info_title');
            this.toast.info(message, title, {
                timeOut: 0,
                extendedTimeOut: 0,
            });
            if (this.reloadList) {
                this.reloadList();
            }
        }).catch(() => {
            this.set('loadingNew', false);
            this.toast.error(this.i18n.t('forks.new_fork_failed'));
        });
    }
}

declare module '@ember/controller' {
  interface Registry {
    'guid-node/forks': GuidNodeForks;
  }
}
