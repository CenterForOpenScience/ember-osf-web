import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { validatePresence } from 'ember-changeset-validations/validators';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import { BufferedChangeset } from 'validated-changeset';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import CollectionProviderModel from 'ember-osf-web/models/collection-provider';
import LicenseModel from 'ember-osf-web/models/license';
import Node from 'ember-osf-web/models/node';
import { validateNodeLicense, validateNodeLicenseYear } from 'ember-osf-web/packages/registration-schema/validations';
import Analytics from 'ember-osf-web/services/analytics';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException from 'ember-osf-web/utils/capture-exception';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ProjectMetadata extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service store!: Store;
    @service toast!: Toast;

    provider!: CollectionProviderModel;
    node!: Node;
    changeset!: BufferedChangeset;

    nodeValidations = {
        title: [
            validatePresence({ presence: true, ignoreBlank: true, type: 'empty' }),
        ],
        description: [
            validatePresence({ presence: true, ignoreBlank: true, type: 'empty' }),
        ],
        license: [
            this.validateCollectionLicense(),
        ],
        nodeLicense: [
            validateNodeLicense(),
            validateNodeLicenseYear(),
        ],
    };

    @requiredAction continue!: () => void;

    init() {
        super.init();
        this.changeset = buildChangeset(this.node, this.nodeValidations);
    }

    @task
    @waitFor
    async reset() {
        this.node.rollbackAttributes();
        await this.node.reload();
    }

    @task
    @waitFor
    async save() {
        await this.changeset.validate();
        if (this.changeset.isValid) {
            try {
                await this.changeset.save();
                this.onSave();
            } catch (e) {
                this.onError(e);
            }
        } else {
            this.toast.error(this.intl.t('app_components.project_metadata.invalid_metadata'));
        }
    }

    validateCollectionLicense() {
        return async (_: unknown, currentLicense: LicenseModel) => {
            const licensesAcceptable = await this.provider.queryHasMany('licensesAcceptable', {
                page: { size: 20 },
            });
            if (!currentLicense) {
                return {
                    context: {
                        type: 'mustSelect',
                    },
                };
            }
            if (!licensesAcceptable.includes(currentLicense)) {
                return {
                    context: {
                        type: 'license_not_accepted',
                    },
                };
            }
            return true;
        };
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
    onError(e: Error) {
        captureException(e);
        this.toast.error(this.intl.t('app_components.project_metadata.save_error'));
    }
}
