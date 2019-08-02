import { action, computed } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Analytics from 'ember-osf-web/services/analytics';

import I18N from 'ember-i18n/services/i18n';
import Registration from 'ember-osf-web/models/registration';
import StatusMessages from 'ember-osf-web/services/status-messages';
import Toast from 'ember-toastr/services/toast';

import currentUser from 'ember-osf-web/services/current-user';

export default class GuidRegistrationForks extends Controller {
    @service toast!: Toast;
    @service i18n!: I18N;
    @service statusMessages!: StatusMessages;
    @service analytics!: Analytics;
    @service currentUser!: currentUser;

    toDelete: Registration | null = null;
    deleteModal = false;
    loadingNew = false;
    newModal = false;

    reloadList?: (page?: number) => void;

    forksQueryParams = { embed: 'bibliographic_contributors' };

    @reads('model.taskInstance.value')
    node?: Registration;

    @computed('node')
    get nodeType(this: GuidRegistrationForks) {
        if (!this.node) {
            return undefined;
        }
        return this.node!.parent ? 'component' : 'project';
    }

    @action
    openDeleteModal(this: GuidRegistrationForks, node: Registration) {
        node.get('children').then(children => {
            if (children.toArray().length) {
                const message = this.i18n.t('forks.unable_to_delete_fork');
                this.toast.error(message);
            } else {
                this.set('toDelete', node);
                this.set('deleteModal', true);
            }
        });
    }

    @action
    closeDeleteModal(this: GuidRegistrationForks) {
        this.set('toDelete', null);
        this.set('deleteModal', false);
    }

    @action
    closeNewModal() {
        this.set('newModal', false);
    }

    @action
    newFork(this: GuidRegistrationForks) {
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

    @action
    delete(this: GuidRegistrationForks) {
        this.set('deleteModal', false);
        const node = this.toDelete;
        if (!node) {
            return;
        }
        this.set('toDelete', null);
        node.deleteRecord();
        node.save().then(() => {
            this.toast.success(this.i18n.t('status.project_deleted'));
            if (this.reloadList) {
                this.reloadList();
            }
        }).catch(() => {
            this.toast.error(this.i18n.t('forks.delete_fork_failed'));
        });
    }
}

declare module '@ember/controller' {
  interface Registry {
    'guid-registration/forks': GuidRegistrationForks;
  }
}
