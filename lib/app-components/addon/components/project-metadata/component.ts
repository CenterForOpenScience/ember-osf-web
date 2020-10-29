import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ProjectMetadata extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service store!: DS.Store;
    @service toast!: Toast;

    node: Node = this.node;

    @requiredAction continue!: () => void;

    @task({ withTestWaiter: true })
    async reset() {
        this.node.rollbackAttributes();
        await this.node.reload();
    }

    @action
    addTag(tag: string) {
        this.analytics.click('button', 'Collection - Submit - Add tag');
        this.node.set('tags', [...this.node.tags.slice(), tag].sort());
    }

    @action
    removeTagAtIndex(index: number) {
        this.analytics.click('button', 'Collections - Submit - Remove tag');
        this.node.set('tags', this.node.tags.slice().removeAt(index));
    }

    @action
    onSave() {
        this.toast.success(this.intl.t('app_components.project_metadata.save_success'));
        this.continue();
    }

    @action
    onError() {
        this.toast.error(this.intl.t('app_components.project_metadata.save_error'));
    }
}
