import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

export default class GuidNodeForks extends Controller {
    @service toast;
    @service i18n;

    toDelete;
    deleteModal = false;
    newModal = false;

    @action
    deleteModalToggle(this: GuidNodeForks, node) {
        this.set('toDelete', node);
        this.toggleProperty('deleteModal');
    }
    @action
    newForkModalToggle() {
        this.toggleProperty('newModal');
    }

    @action
    newFork(this: GuidNodeForks) {
        // this.set('newModal', false);
        const message = this.get('i18n').t('forks.new_fork_info');
        const title = this.get('i18n').t('forks.new_fork_info_title');
        this.get('toast').info(message, title);
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'guid-node/forks': GuidNodeForks;
  }
}
