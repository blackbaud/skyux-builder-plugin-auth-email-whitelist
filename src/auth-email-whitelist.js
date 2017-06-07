const preload = (content, resourcePath, skyAppConfig) => {
  let authEnabled = skyAppConfig.auth || false;
  if (resourcePath.match(/app-extras\.module\.ts$/) && authEnabled) {
    return `${content}
/* tslint:disable:max-line-length */
import { BBAuth } from '@blackbaud/auth-client';
import { SkyAppBootstrapper } from '@blackbaud/skyux-builder/runtime';
import decode = require('jwt-decode');

/* istanbul ignore next */
(SkyAppBootstrapper as any).processBootstrapConfig = () => {
  return BBAuth
    .getToken()
    .then((token: string) => {
      const emailDomainWhitelist: string[] = [
        'blackbaud.com',
        'blackbaud.me',
        'blackbaud.co.uk',
        'blackbaud.au',
        'microedge.com',
        'attentive.ly',
        'everydayhero.com'
      ];
      const parsedToken = decode(token);
      const domain = parsedToken.email.split('@')[1];

      if (emailDomainWhitelist.indexOf(domain) > -1) {
        return Promise.resolve(true);
      }

      return Promise.reject(
        'You must be a Blackbaud employee to access this content. Please log in with a valid Blackbaud email address.'
      );
    });
};
/* tslint:enable:max-line-length */
`;
  }

  return content;
};

module.exports = {
  preload
};
