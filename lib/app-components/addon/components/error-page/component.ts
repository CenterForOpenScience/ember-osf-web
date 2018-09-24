import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

export default class ErrorPage extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service theme!: Theme;

    label: string = defaultTo(this.label, '');
    translationKey: string = defaultTo(this.translationKey, '');

    @computed('theme.{isProvider,provider}')
    get supportEmail(): string {
        const { isProvider, provider } = this.theme;

        // TODO: get default support email from config
        return isProvider && provider && provider.emailSupport ? provider.emailSupport : 'support@osf.io';
    }
}
