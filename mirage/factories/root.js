import { Factory, association } from 'ember-cli-mirage';

export default Factory.extend({
    activeFlags: ['ember_home_page', 'ember_support_page', 'ember_project_forks_page'],
    message: 'Welcome to the OSF API.',
    version: '2.8',
    links: {},
    currentUser: association(),
});
