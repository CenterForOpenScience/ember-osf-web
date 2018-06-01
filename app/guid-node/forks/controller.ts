import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
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

    toDelete: Node | null = null;
    deleteModal = false;
    loadingNew = false;
    newModal = false;
    page = 1;
    forks = [];
    maxPage: number = 1;
    perPage = 10;

    getForks = task(function *(this: GuidNodeForks) {
        const page = this.get('page');
        const model = this.get('model');
        const node = yield model.taskInstance;
        const forks = yield node.queryHasMany('forks', { page, embed: 'contributors' });
        this.setProperties({
            forks,
            maxPage: Math.ceil(forks.meta.total / this.get('perPage')),
        });
    }).restartable();

    @computed('model.taskInstance.value')
    get nodeType(this: GuidNodeForks) {
        if (!this.model.taskInstance.value) {
            return;
        }
        const node = this.model.taskInstance.value;
        return node.get('parent') ? 'component' : 'project';
    }

    @action
    next(this: GuidNodeForks) {
        this.analytics.click('button', 'Project Forks - Pagination Next');
        this.incrementProperty('page');
        this.get('getForks').perform();
    }

    @action
    previous(this: GuidNodeForks) {
        this.decrementProperty('page');
        this.get('getForks').perform();
    }

    @action
    openDeleteModal(this: GuidNodeForks, node: Node) {
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
    closeDeleteModal(this: GuidNodeForks) {
        this.set('toDelete', null);
        this.set('deleteModal', false);
    }

    @action
    newFork(this: GuidNodeForks) {
        this.analytics.click('button', 'Project Forks - Create Fork');
        this.set('newModal', false);
        const node = this.get('model').taskInstance.value;
        this.set('loadingNew', true);
        node.makeFork().then(() => {
            this.set('loadingNew', false);
            const message = this.i18n.t('forks.new_fork_info');
            const title = this.i18n.t('forks.new_fork_info_title');
            this.toast.info(message, title);
        }).catch(() => {
            this.set('loadingNew', false);
            this.toast.error(this.get('i18n').t('forks.new_fork_failed'));
        });
    }

    @action
    delete(this: GuidNodeForks) {
        this.analytics.click('button', 'Project Forks - Delete Fork');
        this.set('deleteModal', false);
        const node = this.toDelete;
        if (!node) {
            return;
        }
        this.set('toDelete', null);
        node.deleteRecord();
        node.save().then(() => {
            this.toast.success(this.get('i18n').t('status.project_deleted'));
            this.set('page', 1);
            this.get('getForks').perform();
        }).catch(() => {
            this.toast.error(this.get('i18n').t('forks.delete_fork_failed'));
        });
    }
}

declare module '@ember/controller' {
  interface Registry {
    'guid-node/forks': GuidNodeForks;
  }
}
