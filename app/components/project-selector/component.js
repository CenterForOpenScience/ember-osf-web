import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

/**
 * @module ember-osf-web
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

export default Component.extend({
    i18n: service(),
    store: service(),

    user: null,
    nodeTitle: null,
    projectSelectState: 'main',
    selectedProject: null,
    isLoadingProjects: true,
    showErrorMessage: null,
    projectList: A(),

    isProjectPublic: alias('selectedProject.public'),

    isChildNode: computed('selectedProject', function() {
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
