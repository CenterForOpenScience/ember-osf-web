import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import LegacyProvider from 'ember-osf-web/packages/addons-service/legacy-provider';
import Provider from 'ember-osf-web/packages/addons-service/provider';
import AddonsServiceManagerComponent from 'osf-components/components/addons-service/manager/component';

interface Args {
    addon: LegacyProvider | Provider;
    manager: AddonsServiceManagerComponent;
}

const legacyAddonLogoMap: Record<string, string> = {
    aws: '/assets/images/addons/logos/aws.png',
    bitbucket: '/assets/images/addons/logos/bitbucket.png',
    boa: '/assets/images/addons/logos/boa_color.png',
    dataverse: '/assets/images/addons/logos/dataverse.png',
    dropbox: '/assets/images/addons/logos/dropbox.png',
    figshare: '/assets/images/addons/logos/figshare.png',
    github: '/assets/images/addons/logos/github.png',
    gitlab: '/assets/images/addons/logos/gitlab.png',
    googledrive: '/assets/images/addons/logos/google.png',
    mendeley: '/assets/images/addons/logos/mendeley.png',
    onedrive: '/assets/images/addons/logos/onedrive.png',
    owncloud: '/assets/images/addons/logos/owncloud.png',
    zotero: '/assets/images/addons/logos/zotero.png',
};

export default class AddonsCardComponent extends Component<Args> {
    @tracked deleteModalOpen = false;

    @action
    closeDeleteModal() {
        this.deleteModalOpen = false;
    }

    @action
    disableAddon() {
        const { addon } = this.args;
        addon.disableProjectAddon();
    }

    get assetLogo() {
        if (this.args.addon instanceof LegacyProvider) {
            return legacyAddonLogoMap[this.args.addon.provider.id];
        } else {
            return this.args.addon.provider.iconUri;
        }
    }

    get addonIsConfigured() {
        const { addon, manager } = this.args;
        return manager.projectEnabledAddons.includes(addon);
    }
}
