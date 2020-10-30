// TODO use as a checklist
import { GitlabCfg } from './gitlab';
import { T } from '../../../../t.const';
import { ConfigFormSection, LimitedFormlyFieldConfig } from '../../../config/global-config.model';
import { GITHUB_INITIAL_POLL_DELAY } from '../github/github.const';

export const DEFAULT_GITLAB_CFG: GitlabCfg = {
  project: null,
  token: null,
  isSearchIssuesFromGitlab: false,
  isAutoPoll: false,
  isAutoAddToBacklog: false,
  filterUsername: null,
};

// NOTE: we need a high limit because git has low usage limits :(
export const GITLAB_MAX_CACHE_AGE = 10 * 60 * 1000;
export const GITLAB_POLL_INTERVAL = GITLAB_MAX_CACHE_AGE;
export const GITLAB_INITIAL_POLL_DELAY = GITHUB_INITIAL_POLL_DELAY + 8000;

// export const GITLAB_POLL_INTERVAL = 15 * 1000;
export const GITLAB_API_BASE_URL = 'https://gitlab.com/api/v4/projects';

export const GITLAB_URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b\//i;
export const GITLAB_PROJECT_REGEX = /(\w-?|\.-?)+((\/|%2F)(\w-?|\.-?)+)+$/i;

export const GITLAB_CONFIG_FORM: LimitedFormlyFieldConfig<GitlabCfg>[] = [
  {
    key: 'project',
    type: 'input',
    templateOptions: {
      label: T.F.GITLAB.FORM.PROJECT,
      type: 'text',
      pattern: /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b\/)((\w-?|\.-?)+((\/|%2F)(\w-?|\.-?)+)+$)|(^(\w-?|\.-?)+((\/|%2F)(\w-?|\.-?)+)+$)/i,
    },
  },
  {
    key: 'token',
    type: 'input',
    templateOptions: {
      label: T.F.GITLAB.FORM.TOKEN,
    },
    validation: {
      show: true,
    },
    expressionProperties: {
      // !! is used to get the associated boolean value of a non boolean value
      // It's not a fancy trick using model.project alone gets the required case right but won't remove it
      // if the project field is empty so this is needed for the wanted behavior
      'templateOptions.required': '!!model.project',
    },
  },
  {
    key: 'isSearchIssuesFromGitlab',
    type: 'checkbox',
    templateOptions: {
      label: T.F.GITLAB.FORM.IS_SEARCH_ISSUES_FROM_GITLAB
    },
  },
  {
    key: 'isAutoPoll',
    type: 'checkbox',
    templateOptions: {
      label: T.F.GITLAB.FORM.IS_AUTO_POLL
    },
  },
  {
    key: 'isAutoAddToBacklog',
    type: 'checkbox',
    templateOptions: {
      label: T.F.GITLAB.FORM.IS_AUTO_ADD_TO_BACKLOG
    },
  },
  {
    key: 'filterUsername',
    type: 'input',
    templateOptions: {
      label: T.F.GITLAB.FORM.FILTER_USER
    },
  },
];

export const GITLAB_CONFIG_FORM_SECTION: ConfigFormSection<GitlabCfg> = {
  title: 'GitLab',
  key: 'GITLAB',
  items: GITLAB_CONFIG_FORM,
  help: T.F.GITLAB.FORM_SECTION.HELP,
};
