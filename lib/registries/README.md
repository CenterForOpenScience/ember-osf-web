# [Registries](https://osf.io/registries)

## Useful Links / Resources

### Jira
* [Portfolio](https://openscience.atlassian.net/secure/PortfolioPlanView.jspa?id=12&sid=12)
* [Registries Backlog](https://openscience.atlassian.net/secure/RapidBoard.jspa?rapidView=138&projectKey=REG&view=planning.nodetail)
* [Releases](https://openscience.atlassian.net/projects/REG?orderField=RANK&selectedItem=com.atlassian.jira.jira-projects-plugin%3Arelease-page&status=unreleased)

#### Epics
1. [Phase 1: Ember Engines](https://openscience.atlassian.net/browse/PRODUCT-766)
1. [Phase 2: Overview Page (Feature Parity)](https://openscience.atlassian.net/browse/PRODUCT-768)
1. Phase 3: Overview Page (Editable Registrations)
1. Phase 4: Submission Workflow
1. Phase 5: Branding

### Resources
* [Analytics (Index & Discover)](https://docs.google.com/spreadsheets/d/1tPTbHsk8tAlkKAyyHU62zO-N_xBBYgPufi-N20jPsr0/edit#gid=0)
* [Example Preg Submission](https://osf.io/6tsnj/register/565fb3678c5e4a66b5582f67)

### Tools
* [Monodraw](https://monodraw.helftone.com/#cli-tool-direct-store) - Software for making ascii charts/drawings

### Tutorials & Stuff Like That
* [CSS Sidebar Transitions](https://tympanus.net/Development/SidebarTransitions/#)
* [CSS Page Transitions](https://tympanus.net/Development/PageTransitions/)
* [Shrinking/Sticky navbar](https://foundation.zurb.com/building-blocks/blocks/topbar-sticky-shrink.html) (Might not be used for anything)

## Diagrams

### Registration Workflow

```
                                                                                                                                                                             ┌──────────────  48 Hours Passed  ──────────────┬─────────────── Admins Disapprove ────────────────┐
                                                                                                                                                                             │                                               │                                                  │
                                                                                                                                                                             │                                               ▼                                                  │
                                                                                                               ┌───────────────────────┐                         ┌───────────────────────┐                       ┌───────────────────────┐                          ┌───────────────────────┐
                                                                                                               │     Registration      │                         │     Registration      │                       │     Registration      │          Embargo         │     Registration      │
                                                                                      ┌────── Embargoed ──────▶│      (Archiving)      │─ Archival Finished ────▶│  (Pending Approval)   │── Admins Approved ───▶│      (Embargoed)      │─────   Ended Early   ───▶│  (Pending Early End)  │
                                                                                      │                        │      (Embargoed)      │                         │      (Embargoed)      │                       │                       │                          │                       │
                                                                                      │                        └───────────────────────┘                         └───────────────────────┘                       └───────────────────────┘                          └───────────────────────┘
                         Approval Not                                                 │                                                                                                                                Embargo Date                                              │
                           Required    ┌─────────────────────┐                        │                                                                                                                                   Passes                                                 │
                          Or Ommited   │ Draft Registration  │ Registered             │                                                                                                                                      │                                                   │
                        ┌─────────────▶│     (Approved)      │────────────────────────┤                                                                                                                                      ├────────────────  Admins Approve   ────────────────┘
                        │              └─────────────────────┘                        │                                                                                                                                      │
           Registration │                         ▲                                   │                                                                                                                                      │
┌─────────┐  Initiated  │                         │                                   │                                                                                                                                      ▼                                                                                      ┌───────────────────────┐
│ Project │─────────────┤                         └────────────┐                      │                        ┌───────────────────────┐                        ┌───────────────────────┐                        ┌───────────────────────┐                          ┌───────────────────────┐                       │                       │
└─────────┘             │                          Approved by │                      │                        │     Registration      │                        │     Registration      │                        │     Registration      │                          │     Registration      │                       │     Registration      │
                        │                           OSF Admin  │                      └─ Public Immediately ──▶│      (Archiving)      │── Archival Finished ──▶│  (Pending Approval)   │─── Admins Approved ───▶│       (Public)        │────     Withdrawn     ──▶│ (Pending Withdrawal)  │──  Admins Approve   ─▶│      (Withdrawn)      │
                        │                                      │                                               │ (Public Immediately)  │                        │ (Public Immediately)  │                        │                       │                          │                       │                       │                       │
                        │  Approval   ┌─────────────────────┐  │                                               └───────────────────────┘                        └───────────────────────┘                        └───────────────────────┘                          └───────────────────────┘                       └───────────────────────┘
                        │  Required   │ Draft Registration  │  │                                                                                                            │                                                ▲                                                  │
                        └────────────▶│      (Pending)      │──┘                                                                                                            │                                                │                                                  │
                                      └─────────────────────┘                                                                                                               └────────────  48 Hours Passed  ─────────────────┴─────────────── Admins Disapprove ────────────────┘
                                      
                                      
                                      
```
