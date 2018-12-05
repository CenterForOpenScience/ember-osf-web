import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import { assert } from '@ember/debug';
import EmberObject, { get } from '@ember/object';
import { isPresent } from '@ember/utils';
import BaseValidator from 'ember-cp-validations/validators/base';
import License from 'ember-osf-web/models/license';
import Node from 'ember-osf-web/models/node';
import { Deserialized } from 'ember-osf-web/transforms/node-license';

interface Options extends EmberObject {
    on: keyof Node;
}

export default class NodeLicense extends BaseValidator {
    @service intl!: Intl;

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
            .filter((field: keyof Deserialized) => !value[field])
            .sort()
            .map(field => this.intl.t(`app_components.license_picker.fields.${field}`))
            .join(', ');

        if (missingFields.length) {
            return this.createErrorMessage('node_license_missing_fields', value, { missingFields });
        }

        return true;
    }
}
