import { action } from '@ember/object';
import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';

const { cedarConfig } = config;

interface Args {
    instanceObject: any;
    templateObject: any;
}

export default class CedarMetadataEditor extends Component<Args> {

    config = {
        /*
        sampleTemplateLocationPrefix: 'http://localhost:4240/cedar-embeddable-editor-sample-templates/',
        loadSampleTemplateName: '01',
        expandedSampleTemplateLinks: true,
        */
        showTemplateRenderingRepresentation: false,
        showInstanceDataCore: false,
        showMultiInstanceInfo: false,
        expandedInstanceDataFull: false,
        expandedInstanceDataCore: false,
        expandedMultiInstanceInfo: false,
        expandedTemplateRenderingRepresentation: false,
        showInstanceDataFull: false,
        showTemplateSourceData: false,
        expandedTemplateSourceData: false,
        collapseStaticComponents: false,
        showHeader: false,
        showFooter: false,
        showStaticText: false,
        defaultLanguage: 'en',
        fallbackLanguage: 'en',
    };

    @action
    save() {
        /*
        const cee = document.querySelector('cedar-embeddable-editor');
        console.log(cee.metadata);
        */
    }
    cedarConfig = cedarConfig;
}
