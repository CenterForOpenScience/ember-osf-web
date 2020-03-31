import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat } from 'ember-changeset-validations/validators';
import { ChangesetDef } from 'ember-changeset/types';
import { task } from 'ember-concurrency-decorators';
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
    changeset: ChangesetDef;
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

    requestedEditMode: boolean = false;
    validationNode!: ValidationObject<Registration>;
    changeset!: ChangesetDef;
    didValidate = false;

    @not('didValidate') didNotValidate!: boolean;
    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
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

    @task({ restartable: true })
    save = task(function *(this: PublicationDoiManagerComponent) {
        this.changeset.validate();

        this.set('didValidate', true);

        if (!this.changeset.isValid) {
            return;
        }

        this.changeset.execute();
        const doi = extractDoi(this.validationNode.articleDoi);

        this.node.set('articleDoi', doi);
        try {
            yield this.node.save();
        } catch (e) {
            this.node.rollbackAttributes();
            this.toast.error(
                getApiErrorMessage(e) ||
                this.intl.t('registries.registration_metadata.edit_pub_doi.error'),
            );
            captureException(e);
            throw e;
        }
        this.set('requestedEditMode', false);
        this.toast.success(this.intl.t('registries.registration_metadata.edit_pub_doi.success'));
    });

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
