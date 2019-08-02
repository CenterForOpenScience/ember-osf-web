import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import EmberObject, { get } from '@ember/object';
import { isPresent } from '@ember/utils';
import BaseValidator from 'ember-cp-validations/validators/base';
import I18N from 'ember-i18n/services/i18n';
import License from 'ember-osf-web/models/license';
import Node from 'ember-osf-web/models/node';

interface Options extends EmberObject {
    on: 'license';
}

export default class NodeLicenseValidator extends BaseValidator {
    @service i18n!: I18N;

    async validate(
        value: Node['nodeLicense'],
        options: Options,
        model: Node,
        attribute: string,
    ): Promise<string | true> {
        const on = get(options, 'on');

        assert(`[validator:node-license] [${attribute}] option 'on' is required`, isPresent(on));

        const license: License = await get(model, on);

        if (!license || !license.requiredFields || !license.requiredFields.length) {
            return true;
        }

        if (!value) {
            return this.createErrorMessage('node_license_invalid', value, options);
        }

        const missingFields = license.requiredFields
            .filter(field => !value[field])
            .sort()
            .map(field => this.i18n.t(`app_components.license_picker.fields.${field}`))
            .join(', ');

        if (missingFields.length) {
            return this.createErrorMessage('node_license_missing_fields', value, { missingFields });
        }

        return true;
    }
}
