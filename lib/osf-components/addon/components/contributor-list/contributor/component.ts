import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import { Contrib } from '../component';
import template from './template';

@layout(template)
@tagName('span')
export default class ContributorListContributor extends Component {
    contributor: Contrib = defaultTo(this.contributor, { title: '', id: '' });
    useLink: boolean = defaultTo(this.useLink, false);
}
