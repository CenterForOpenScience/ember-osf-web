import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import Node from 'ember-osf-web/models/node';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class LicenseText extends Component {
    // Required
    node!: Node;

    // Private
    @service intl!: Intl;
    @alias('node.license') license!: License;

    @computed('license.text', 'node.{isAnonymous,nodeLicense}')
    get licenseText(): string {
        const {
            license,
            node,
            intl,
        } = this;

        const nodeLicense = node.get('nodeLicense');
        const isAnonymous = node.get('isAnonymous');

        const licenseText = license.get('text') || '';

        if (!nodeLicense) {
            return licenseText;
        }

        return Object.entries(nodeLicense).reduce(
            (text, [key, value]) => text.replace(
                new RegExp(`{{${key}}}`),
                isAnonymous
                    ? intl.t('app_components.license_text.anonymized_placeholder')
                    : value,
            ),
            licenseText,
        );
    }
}
