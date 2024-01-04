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
        sampleTemplateLocationPrefix: 'http://localhost:4240/cedar-embeddable-editor-sample-templates/',
        loadSampleTemplateName: '01',
        expandedSampleTemplateLinks: true,
        showTemplateRenderingRepresentation: true,
        showInstanceDataCore: true,
        expandedInstanceDataCore: false,
        showMultiInstanceInfo: true,
        expandedMultiInstanceInfo: false,
        expandedTemplateRenderingRepresentation: false,
        showInstanceDataFull: false,
        expandedInstanceDataFull: false,
        showTemplateSourceData: true,
        expandedTemplateSourceData: false,
        showHeader: true,
        showFooter: true,
        defaultLanguage: 'en',
        fallbackLanguage: 'en',
        collapseStaticComponents: false,
        showStaticText: true,
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
