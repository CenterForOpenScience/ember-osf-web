import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default class GuidNodeForks extends Controller {
    @service toast;
    @service i18n;
    @service statusMessages;

    toDelete;
    deleteModal = false;
    newModal = false;
    page = 1;
    forks = [];
    maxPage: number = 1;
    perPage = 10;

    getForks = task(function* (this: GuidNodeForks) {
        const page = this.get('page');
        const node = yield this.get('model.taskInstance');
        const forks = yield node.queryHasMany('forks', { page });
        this.setProperties({
            forks,
            maxPage: Math.ceil(forks.meta.total / this.get('perPage')),
        });
    });

    @action
    next(this: GuidNodeForks) {
        this.incrementProperty('page');
        this.get('getForks').perform();
    }

    @action
    previous(this: GuidNodeForks) {
        this.decrementProperty('page');
        this.get('getForks').perform();
    }

    @action
    openDeleteModal(this: GuidNodeForks, node) {
        node.get('children').then(children => {
            if (children.toArray().length) {
                const message = this.get('i18n').t('forks.unable_to_delete_fork');
                this.get('toast').error(message);
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
        this.set('newModal', false);
        const node = this.get('model.taskInstance.value');
        node.fork().then(() => {
            const message = this.get('i18n').t('forks.new_fork_info');
            const title = this.get('i18n').t('forks.new_fork_info_title');
            this.get('toast').info(message, title);
        }).catch(() => {
            this.get('toast').error(this.get('i18n').t('forks.new_fork_failed'));
        });
    }

    @action
    delete(this: GuidNodeForks) {
        this.set('deleteModal', false);
        const node = this.get('toDelete');
        this.set('toDelete', null);
        node.deleteRecord();
        node.save().then(() => {
            this.get('toast').success(this.get('i18n').t('status.project_deleted'));
            this.set('page', 1);
            this.get('getForks').perform();
        }).catch(() => {
            this.get('toast').error(this.get('i18n').t('forks.delete_fork_failed'));
        });
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'guid-node/forks': GuidNodeForks;
  }
}
