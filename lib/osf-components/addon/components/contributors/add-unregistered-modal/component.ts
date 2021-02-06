import { action } from '@ember/object';
import Component from '@glimmer/component';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat, validatePresence } from 'ember-changeset-validations/validators';
import { Permission } from 'ember-osf-web/models/osf-model';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

interface AddUnregisteredModalArgs {
    addUnregisteredContributor: (
        email: string,
        fullName: string,
        permission: Permission,
        bibliographic: boolean,
    ) => null;
}

interface UnregisteredFormFields {
    email: string;
    fullName: string;
    permission: string;
    bibliographic: boolean;
}

const UnregisteredFormValidations: ValidationObject<UnregisteredFormFields> = {
    email: [
        validateFormat({
            type: 'email',
            allowBlank: true,
            translationArgs: { description: 'This field' },
        }),
    ],
    fullName: validatePresence({
        presence: true,
        type: 'empty',
    }),
};

export default class UserSearchComponent extends Component<AddUnregisteredModalArgs> {
    unregisteredFormChangeset = buildChangeset({
        email: null,
        fullName: null,
        permission: Permission.Write,
        bibliographic: true,
    }, UnregisteredFormValidations);
    permissionOptions = [...Object.values(Permission)];

    @action
    validate() {
        this.unregisteredFormChangeset.validate();
        if (this.unregisteredFormChangeset.isInvalid) {
            return Promise.reject();
        }
        return Promise.resolve();
    }

    @action
    clearChangeset() {
        this.unregisteredFormChangeset.rollback();
    }
}
