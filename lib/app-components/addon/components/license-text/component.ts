import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import Node from 'ember-osf-web/models/node';
import template from './template';

@layout(template)
@tagName('')
export default class LicenseText extends Component {
    node!: Node;

    @alias('node.license') license!: License;

    /**
     * This replaces the placeholders, e.g. `{{field}}`, in the license text (which acts as a template)
     * TODO: Dynamic computed properties. `year` and `copyrightHolders` are the only two acceptable fields on
     * nodeLicense, currently.
     */
    @computed('license.{text,requiredFields.[]}', 'node.nodeLicense.{year,copyrightHolders}')
    get licenseText(): string {
        const requiredFields = this.license.get('requiredFields');
        const result = this.license.get('text') || '';

        if (!this.node.nodeLicense || !(requiredFields && requiredFields.length)) {
            return result;
        }

        return Object.entries(this.node.nodeLicense).reduce(
            (acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`), value),
            result,
        );
    }
}
