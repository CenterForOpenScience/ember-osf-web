import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { Assets } from 'ember-osf-web/models/provider';
import Theme from 'ember-osf-web/services/theme';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ErrorPage extends Component {
    @service theme!: Theme;

    @alias('theme.provider.assets') assets!: Assets;
}
