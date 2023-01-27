import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import config from 'ember-get-config';

import pathJoin from 'ember-osf-web/utils/path-join';

import NodeMetadataManagerComponent from '../node-metadata-manager/component';

const {
    support: { supportEmail },
    OSF: { url: baseURL },
} = config;

interface Args {
    manager: NodeMetadataManagerComponent;
}

export default class NodeMetadataForm extends Component<Args> {
    @service intl!: Intl;
    @tracked resourceHelpOpen = false;
    @tracked funderHelpText = false;

    supportEmail = supportEmail;

    get filesUrl() {
        const { node } = this.args.manager;
        return pathJoin(baseURL, node.id, 'files');
    }

    get nodeTypeTranslation() {
        const { node } = this.args.manager;
        const translationKeyBase = 'general';
        const translationNode = node.isRegistration ? 'registration' : node.isRoot ? 'project' : 'component';
        return this.intl.t(`${translationKeyBase}.${translationNode}`);
    }
}
