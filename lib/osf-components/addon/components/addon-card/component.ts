import Component from '@glimmer/component';

import Provider from 'ember-osf-web/packages/addons-service/provider';
import AddonsServiceManagerComponent from 'osf-components/components/addons-service/manager/component';

interface Args {
    addon: Provider;
    manager: AddonsServiceManagerComponent;
}

export default class AddonsCardComponent extends Component<Args> {

    get assetLogo() {
        return this.args.addon.provider.iconUrl;
    }

    get addonIsConfigured() {
        return this.args.addon.isConfigured;
    }
}
