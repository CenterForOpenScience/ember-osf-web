import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ReadOnlyContributorList extends Component {
    osfUrl = config.OSF.url;
}
