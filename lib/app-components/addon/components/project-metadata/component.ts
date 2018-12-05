import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
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
    makePublicOnSave: boolean = defaultTo(this.makePublicOnSave, false);
    @requiredAction continue!: () => void;

    reset = task(function *(this: ProjectMetadata) {
        this.node.rollbackAttributes();
        yield this.node.reload();
    });

    save = task(function *(this: ProjectMetadata) {
        try {
            if (this.makePublicOnSave) {
                this.node.set('public', true);
            }

            yield this.node.save();
            this.toast.success(this.intl.t('app_components.project_metadata.save_success'));
            this.continue();
        } catch (e) {
            this.toast.error(this.intl.t('app_components.project_metadata.save_error'));
        }
    });

    @action
    addTag(this: ProjectMetadata, tag: string) {
        this.analytics.click('button', 'Collection - Submit - Add tag');
        this.node.set('tags', [...this.node.tags.slice(), tag].sort());
    }

    @action
    removeTagAtIndex(this: ProjectMetadata, index: number) {
        this.analytics.click('button', 'Collections - Submit - Remove tag');
        this.node.set('tags', this.node.tags.slice().removeAt(index));
    }
}
