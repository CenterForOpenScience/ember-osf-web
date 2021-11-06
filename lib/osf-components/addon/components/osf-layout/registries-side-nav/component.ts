import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { and, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import Intl from 'ember-intl/services/intl';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';


@tagName('')
@layout(template, styles)
export default class RegistriesSideNav extends Component {
    @service media!: Media;
    @service toast!: Toast;
    @service intl!: Intl;

    toDelete: SchemaResponseModel | null;
    deleteEdit = false;

    reloadList?: (page?: number) => void; // bound by paginated-list

    // Optional params
    onLinkClicked?: () => void;

    // Private properties
    shouldCollapse = false;

    @or('media.{isDesktop,isJumbo}')
    isCollapseAllowed!: boolean;

    @and('isCollapseAllowed', 'shouldCollapse')
    isCollapsed!: boolean;

    @action
    toggle() {
        this.toggleProperty('shouldCollapse');
    }

    @action
    delete() {
        this.set('deleteEdit', false);
        const node = this.toDelete;
        if (!node) {
            return;
        }
        this.set('toDelete', null);
        // node.deleteRecord();
        node.destroyRecord();
        // node.save().then(() => {
        //     this.toast.success(this.intl.t('status.project_deleted'));
        //     if (this.reloadList) {
        //         this.reloadList();
        //     }
        // }).catch(() => {
        //     this.toast.error(this.intl.t('forks.delete_fork_failed'));
        // });
    }
}
