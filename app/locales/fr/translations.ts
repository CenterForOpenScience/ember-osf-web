/* tslint:disable:object-literal-sort-keys max-line-length */

export default {
    general: {
        OSF: 'OSF',
        share: 'Partager',
        embed: 'Intégrer',
        download: 'Télécharger',
        delete: 'Supprimer',
        view: 'Voir',
        edit: 'Modifier',
        cancel: 'Annuler',
        revisions: 'Revisions',
        md5: 'MD5',
        date: 'Date',
        sha2: 'SHA2',
        title: 'Titre',
        contributors: 'Contributeurs',
        modified: 'Modifié',
        description: 'Description',
        create: 'Créer',
        and: 'Et',
        more: 'Plus',
        upload: 'Téléverser',
        rename: 'Renommer',
        move: 'Déplacer',
        name: 'Nom',
        size: 'Taille',
        version: 'Version',
        downloads: 'Téléchargements',
        close: 'Fermer',
        back: 'Arrière',
        filter: 'Filtrer',
        revert: 'Revert',
        save: 'Enregistrer',
    },
    quickfiles: {
        title: 'Les Quick Files à {{user-name}}',
        description: 'Les fichiers téléversés ici sont <b>publiquement accessible</b> et trop simple à partager avec les autres en utilisant un lien.',
        feedback_dialog_text: 'Que pensez-vous des Quick Files',
        transition_auth: 'Connectez-vous pour avoir accés à vos Quick Files. En train de vous transférer à la page de connexion',
    },
    feedback: {
        button_text: 'Commentaires',
        placeholder: 'Partagez vos commentaires',
        follow_up_label: 'Contacte-moi à propos des moyens d\'améliorer l\'OSF',
        title: 'Envoyer vos commentaires',
        confirm_button_text: 'Envoyer',
        thank_you: 'Merci!',
        success: 'Vos commentaires ont été envoyés avec succès',
        dismiss: 'Okay',
    },
    file_detail: {
        version: {
            id: 'ID de version',
            title: '(Version: {{version-number}})',
        },
        embed: {
            dynamic: 'Rendre dynamiquement l\'iframe à l\'aide de JavaScript',
            direct: 'Direct iframe à largeur et longueur fixes',
        },
        tags: 'Mots clés:',
        toggle: 'Basculer la vue:',
        delete_file: {
            question: 'Supprimer le fichier?',
            confirm: 'Êtes-vous sure de vouloir supprimer le fichier <b>{{file-name}}</b>',
        },
        sha2_description: 'SHA-2 est une famille de fonctions de hashage conçue par la <i>National Security Angency</i> (NSA) des États-Unis pour vérifier l\'integrité des données.',
        md5_description: 'MD5 est une fonction de hachage cryptographique qui permet d\'obtenir l\'empreinte numérique d\'un fichier',
        // toast messages
        delete_success: 'Fichier suprimé',
        delete_fail: 'Erreur, impossible de supprimer votre fichier',
        save_success: 'Fichier enregistré',
        save_fail: 'Erreur, impossible d\'enregistrer votre fichier',
    },
    file_browser: {
        loading: 'Chargement en cours...',
        delete_multiple: 'Supprimer plusieurs fichiers?',
        download_zip: 'Télécharger comme zip',
        drop_placeholder: 'Déposer des fichiers ici afin de téléverser',
        drop_reminder: 'Déposer un fichier afin de téléverser',
        no_files: 'Cet utilisateur n\'a téléversé aucun fichier quickfile',
        info: {
            title: 'Comment utiliser le navigateur de fichiers',
            upload: '<b>Téléverser:</b> un seul fichier en glissant-déposant ou en cliquant sur le bouton téléverser.',
            select: '<b>Sélectionner des rangées:</b> Cliquer sur un rangé pour voir ce que vous pouvez faire de plus dans la barre d\'outils. Utiliser les clés Commande ou Shift pour selectionner plusieurs fichiers.',
            folders: '<b>Dossiers:</b> pas supportés; veuillez utiliser un project sur OSF afin de téléverser et gérer plusieurs fichiers.',
            open1: '<b>Ouvrir les fichiers:</b> Cliquer sur le nom du fichier pour le voir sur l\'OSF.',
            open2: '<b>Ouvrir les fichiers dans un nouveau tab:</b> Appuyer sur Commande (Ctrl en Windows) puis cliquer sur le nom du fichier.',
            download: '<b>Télécharger comme zip:</b> Cliquer sur le bouton "Download as Zip" dans la barre d\'outils afin de télécharger comme .zip.',
        },
        delete_modal: {
            title: 'Supprimer "{{selectedItems.firstObject.itemName}}"?',
            title_multiple: 'Supprimer plusieurs fichiers?',
            body: 'Cette action est irréversible',
        },
        conflict_modal: {
            title: 'Un fichier au nom de {{textValue}} existe déjà à cet endroit.',
            keep_info: '"Garder les deux" va retenir les deux fichiers (et leurs versions precedents) à cet endroit.',
            replace_info: '"Remplacer" va réecrir le fichier existant à cet endroit. Vous allez perdre les autres versions du fichier réecris. Vous garderai les versions précédent du fichier deplacé.',
            keep_button: 'Garder les deux',
            replace_button: 'Remplacer',
        },
        move_modal: {
            title: 'Déplacer le fichier vers un projet',
            move_button: 'Déplacer un fichier',
        },

    },
    dashboard: {
        title: 'Tableau de bord',
        create_new_project_button: 'Créer un projet',
        quicksearch: {
            search: 'Rechercher vos projets',
            other_links: 'Aller à <a href="/myprojects/">Mes Projets</a> pour organizer votre étude ou <a href="/search/">rechercher</a> sur l\'OSF',
            no_results: 'Aucun résultat!',
            no_projects: {
                line1: 'Vous n\'avez aucun projet. Créer un projet à l\'aide du bouton en haut à droite.',
                line2: 'Cette fonctionnalité vous permet de rechercher et rapidement accéder vos projets.',
                preview_alt: 'Aperçu d\'un projet complet',
            },
            private_parent: 'Projet privé / ',
            private_grandparent: 'Projet privé / Privé / ',
        },
        noteworthy: {
            description: 'Découvrer des projets publics',
            new_and_noteworthy: 'Nouveaux et Remarquables',
            failed_noteworthy: 'Échec du chargement des projects "Nouveaux et Remarquables"',
            most_popular: 'Plus populaires',
            failed_popular: 'Échec du chargement de projets "Plus Populaires"',
            search_more: 'Rechercher plus de projets',
            by: 'à travers',
        },
        meetings: {
            title: 'Hosting a conference or meeting?',
            description: 'Use the OSF for Meetings service to provide a central location for conference submissions.',
            button: 'Voir meetings',
        },
        preprints: {
            title: 'Naviguer les recherches précédentes',
            description: 'Consulter les plus recent des preprints hébergés sur OSF couvrant une variété de domaines de recherche.',
            button: 'Voir les preprints',
        },
    },
    new_project: {
        header: 'Créer un nouveau projet',
        title_placeholder: 'Entrer le titre du projet',
        more: 'Plus',
        affiliation: 'Affiliation',
        remove_all: 'Enlever tous',
        select_all: 'Sélectionner tous',
        no_matches: 'Aucun résultat',
        description_placeholder: 'Entrez la description du projet',
        template_title: 'Modèle (facultatif)',
        template_search_help: 'Start typing to search your projects. Selecting project as template will duplicate its structure in the new project without importing the content of that project.',
        template_placeholder: 'Sélectionner un projet à utiliser comme modèle',
        success_message: 'Nouveau projet créer avec succés!',
        stay_here: 'Continuer à travailler ici',
        go_to_new: 'Allez au nouveau projet',
    },
    banners: {
        prereg: {
            description: 'Améliorer votre prochaine étude. Commencer le Prereg Défi où vous pourrez gagner un prix de $1,000.',
            button: 'Commencer le Prereg Défi',
        },
    },
    move_to_project: {
        create_new_project: 'Créer un nouveau projet',
        connect_to_existing: 'Lier un fichier à un projet existant sur OSF',
        enter_project_title: 'Entréer le titre du projet',
        new_project_message: 'Vous avez selectionné de créer un nouveau projet public pour votre fichier. Les utilisateurs d\'OSF auront toujours accés à votre fichier à moins que vous rendez le projet privé.',
        choose_project: 'Sélectionner un projet',
        project_select_message: 'Vous voyez la liste de projets and composants pour lesquels vous avez accés ecriture. Registrations non inclus.',
        no_projects_exist_error: 'Vous n\'avez aucun projet. Retourner pour créer un nouveau project.',
        could_not_create_project: 'Impossible de créer le project. Veuillez réessayer.',
        convert_or_copy_message: {
            project: 'En cliquant "Déplacer fichier", vos modifications seront immediatement effectués sur votre projet OSF et votre fichier sera deplacé.',
            component: 'En cliquant "Déplacer fichier", vos modifications seront immediatement effectués sur votre composant OSF et votre fichier sera deplacé.',
        },
        no_longer_public_warning: {
            project: 'Les fichiers déplacés vers des projets privés ne seront publique ou retrouvable par les autres.',
            component: 'Les fichiers déplacés vers des composants privés ne seront plus publique ou retrouvable par les autres.',
        },
        file_successfully_moved: 'Fichier déplacé avec succés!',
        could_not_move_file: 'Impossible de déplacer le fichier. Veuillez réessayer',
        keep_working_here: 'Continuer à travailler ici',
        go_to_new_project: 'Allez au nouveau projet',
        go_to_component: 'Allez au component',
        go_to_project: 'Allez au projet',
    },
    navbar: {
        add: 'Ajouter',
        add_a_preprint: 'Ajouter un {{preprintWords.preprint}}',
        browse: 'Naviguer',
        cancel_search: 'Annuler la recherche',
        donate: 'Faire un don',
        go_home: 'Retour à la page d\'accueil',
        my_projects: 'Mes Projets',
        my_quick_files: 'Mes Quick Files',
        reviews: 'Mes revisions',
        search: 'Rechercher',
        search_help: 'Rechercher de l\'aide',
        search_the_OSF: 'Rechercher sur l\'OSF',
        send_search: 'Envoyer la requête de recherche',
        support: 'Aide',
        toggle_primary: 'Basculer la navigation primaire',
        toggle_secondary: 'Basculer la navigation secondaire',
    },
    auth_dropdown: {
        log_out: 'Déconnecter',
        my_profile: 'Mon profil',
        osf_support: 'Aide sur l\'OSF',
        settings: 'Paramètres',
        sign_up: 'Créer un compte OSF',
        sign_in: 'Connecter',
        user_gravatar: 'Gravatar d\'utilisateur',
        toggle_auth_dropdown: 'Basculer le ménu deroulant d\'authentification',
    },
    search_help_modal: {
        close: 'Fermer',
        search_help: 'Rechercher',
        queries: 'Requêtes',
        search_uses_the: 'La recherche utilises un ',
        search_syntax: 'La syntaxe de recherche',
        help_description: 'Ceci vous donne plein d\'options, en même temps c\'est trop facile à utiliser. Examples de recherches valides:',
    },
};
