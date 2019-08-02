import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18n from 'ember-i18n/services/i18n';

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
    @service i18n!: I18n;
    @alias('node.license') license!: License;

    @computed('license.text', 'node.{isAnonymous,nodeLicense}')
    get licenseText(): string {
        const {
            license,
            node,
            i18n,
        } = this;

        const {
            nodeLicense,
            isAnonymous,
        } = node;

        const licenseText = license.get('text') || '';

        if (!nodeLicense) {
            return licenseText;
        }

        return Object.entries(nodeLicense).reduce(
            (text, [key, value]) => text.replace(
                new RegExp(`{{${key}}}`),
                isAnonymous ?
                    i18n.t('app_components.license_text.anonymized_placeholder') :
                    value,
            ),
            licenseText,
        );
    }
}
