import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { and } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Provider from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import layout from './template';

@tagName('')
export default class ProviderLogo extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    provider: Provider = this.provider;

    @and('provider.domain', 'provider.domainRedirectEnabled')
    useExternalLink!: boolean;

    @computed('provider.id')
    get logoAsset(): string {
        return [
            '/ember_osf_web/assets/osf-assets/files/collections-assets/',
            this.provider.id,
            '/square_color_no_transparent.png',
        ].join('');
    }
}
