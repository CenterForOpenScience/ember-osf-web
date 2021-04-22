import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat } from 'ember-changeset-validations/validators';
import { BufferedChangeset } from 'ember-changeset/types';
import { restartableTask } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { DOIRegex, extractDoi } from 'ember-osf-web/utils/doi';
import template from './template';

export interface PublicationDoiManager {
    save: () => void;
    publicationDoi: string;
    inEditMode: boolean;
    didValidate: boolean;
    changeset: BufferedChangeset;
}

const DoiValidations: ValidationObject<Registration> = {
    articleDoi: [
        validateFormat({
            allowBlank: true,
            regex: DOIRegex,
            type: 'invalid_doi',
        }),
    ],
};

@tagName('')
@layout(template)
export default class PublicationDoiManagerComponent extends Component {
    // required
    node!: Registration;

    // private
    @service intl!: Intl;
    @service toast!: Toast;

    requestedEditMode = false;
    validationNode!: ValidationObject<Registration>;
    changeset!: BufferedChangeset;
    didValidate = false;

    @not('didValidate') didNotValidate!: boolean;
    @alias('node.userHasWritePermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @alias('node.category') category!: boolean;

    @computed('node.articleDoi')
    get fieldIsEmpty() {
        return !this.node.articleDoi;
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @restartableTask
    @waitFor
    async save() {
        this.changeset.validate();

        this.set('didValidate', true);

        if (!this.changeset.isValid) {
            return;
        }

        this.changeset.execute();
        const doi = extractDoi(this.validationNode.articleDoi);

        this.node.set('articleDoi', doi);
        try {
            await this.node.save();
        } catch (e) {
            this.node.rollbackAttributes();
            const errorMessage = this.intl.t('registries.registration_metadata.edit_pub_doi.error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
        this.set('requestedEditMode', false);
        this.toast.success(this.intl.t('registries.registration_metadata.edit_pub_doi.success'));
    }

    didReceiveAttrs() {
        if (this.node) {
            this.setProperties({
                validationNode: { articleDoi: this.node.articleDoi },
            });
            this.setProperties({
                changeset: buildChangeset(this.validationNode, DoiValidations),
            });
        }
    }

    @action
    startEditing() {
        this.set('requestedEditMode', true);
    }

    @action
    cancel() {
        this.setProperties({
            requestedEditMode: false,
            didValidate: false,
        });
        this.changeset.rollback();
    }
}
