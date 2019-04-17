import config from 'ember-get-config';

const osfUrl = config.OSF.url;
const serviceLinks = {
    exploreActivity: `${osfUrl}explore/activity/`,
    meetingsHome: `${osfUrl}meetings/`,
    myProjects: `${osfUrl}myprojects/`,
    myQuickFiles: `${osfUrl}quickfiles/`,
    osfHome: osfUrl,
    osfSupport: `${osfUrl}support/`,
    preprintsDiscover: `${osfUrl}preprints/discover/`,
    preprintsHome: `${osfUrl}preprints/`,
    preprintsSubmit: `${osfUrl}preprints/submit/`,
    preprintsSupport: 'https://openscience.zendesk.com/hc/en-us/categories/360001530554',
    profile: `${osfUrl}profile/`,
    registriesDiscover: `${osfUrl}registries/discover/`,
    registriesHome: `${osfUrl}registries/`,
    registriesSupport: 'https://openscience.zendesk.com/hc/en-us/categories/360001550953',
    search: `${osfUrl}search/`,
    settings: `${osfUrl}settings/`,
    reviewsHome: `${osfUrl}reviews/`,
    institutionsLanding: `${osfUrl}institutions/`,
    collectionsHome: `${osfUrl}collections/`,
};

export {
    serviceLinks,
};
