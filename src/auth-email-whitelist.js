const preload = (content, resourcePath, skyAppConfig) => {
  let authEnabled = (skyAppConfig.skyux.auth === 'true' || skyAppConfig.skyux.auth === true);
  if (resourcePath.match(/app-extras\.module\.ts$/) && authEnabled) {
    return `${content}
/* tslint:disable:max-line-length */
import { BBAuth } from '@blackbaud/auth-client';
import { SkyAppBootstrapper, SkyAppWindowRef } from '@blackbaud/skyux-builder/runtime';
const decode = require('jwt-decode');

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

      const windowRef = new SkyAppWindowRef();
      const nativeWindow = (windowRef.nativeWindow as any);
      const redirectUrl = nativeWindow.encodeURIComponent(nativeWindow.location.href);

      document.write('<h1>Unauthorized</h1><p>You must be a Blackbaud employee to access this content. Please <a href="https://signin.blackbaud.com/signout?RedirectUrl=' + redirectUrl + '">sign in</a> with a valid Blackbaud email address.</p>');

      return Promise.reject('Unauthorized');
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
