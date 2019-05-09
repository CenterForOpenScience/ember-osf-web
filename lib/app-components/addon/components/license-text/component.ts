import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import EmberObject from '@ember/object';
import I18n from 'ember-i18n/services/i18n';

import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import Node from 'ember-osf-web/models/node';
import { NodeLicense } from 'ember-osf-web/transforms/node-license';

import styles from './styles';
import template from './template';

function interpolateValues(text: string, valueMap: NodeLicense) {
    return Object.entries(valueMap).reduce(
        (acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`), value),
        text,
    );
}

@layout(template, styles)
@tagName('')
export default class LicenseText extends Component {
    // Required
    node!: Node;

    // Private
    @service i18n!: I18n;
    @alias('node.license') license!: License;

    /**
     * This replaces the placeholders, e.g. `{{field}}`, in the license text (which acts as a template)
     * TODO: Dynamic computed properties or @tracked. `year` and `copyrightHolders` are the only two
     * acceptable fields on nodeLicense, currently.
     */
    @computed('license.{text,requiredFields.[]}', 'node.isAnonymous', 'node.nodeLicense.{year,copyrightHolders}')
    get licenseText(): string {
        const requiredFields = this.license.get('requiredFields');
        const licenseText = this.license.get('text') || '';

        if (!this.node.nodeLicense || !requiredFields || !requiredFields.length) {
            return licenseText;
        }

        if (this.node.isAnonymous) {
            return interpolateValues(
                licenseText,
                requiredFields.reduce(
                    (acc, field) => {
                        acc.set(field, this.i18n.t('app_components.license_text.anonymized_placeholder'));
                        return acc;
                    },
                    EmberObject.create() as NodeLicense,
                ),
            );
        }

        return interpolateValues(licenseText, this.node.nodeLicense);
    }
}
