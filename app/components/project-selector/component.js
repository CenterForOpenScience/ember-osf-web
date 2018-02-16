import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * project-selector - to be used within a modal to select existing projects or create a new one
 * Mainly used in Quick Files as a way to move file to project
 *
 * Same usage:
 * ``` handlebars
 * {{project-selector
 *  user=user
 *  file=file
 *  projectSelectState=projectSelectState
 *  setSelectedNode=(action 'setSelectedNode')
 *  changeProjectSelectState=(action 'changeProjectSelectState')
 *  checkNodeTitleKeypress=(action 'checkNodeTitleKeypress')}
 * ```
 * @class project-selector
 */

export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),
    store: Ember.inject.service(),
    panelActions: Ember.inject.service('panelActions'),
    user: null,
    nodeTitle: null,
    projectSelectState: 'main',
    selectedProject: null,
    isLoadingProjects: true,
    showErrorMessage: null,
    projectList: Ember.A(),
    isProjectPublic: Ember.computed.alias('selectedProject.public'),

    isChildNode: Ember.computed('selectedProject', function() {
        // sets the selected node and determines if node is child
        const isChild = this.get('selectedProject.links.relationships.parent');
        this.setSelectedNode(this.get('selectedProject'), isChild);
        return isChild;
    }),

    actions: {
        changeState(state) {
            this.set('selectedProject', null);
            this.changeProjectSelectState(state);
        },
        checkNodeTitleKeypress(value) {
            this.checkNodeTitleKeypress(value);
        },
    },
});
