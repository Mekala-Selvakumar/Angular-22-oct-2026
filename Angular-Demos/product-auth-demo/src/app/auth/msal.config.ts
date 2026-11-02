import {
  PublicClientApplication,
  IPublicClientApplication,
  InteractionType,
  BrowserCacheLocation
} from '@azure/msal-browser';

import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';

export function MSALInstanceFactory():
  IPublicClientApplication {

  return new PublicClientApplication({

    auth: {

      clientId: '13aac3b9-f30a-4689-8f5a-a34fb7c49a3d',

      //tenant id
      authority:
        'https://login.microsoftonline.com/6ea96e7a-5c37-4ae5-b283-9f4f97f500c5',

      redirectUri: 'http://localhost:4200/',

      postLogoutRedirectUri: 'http://localhost:4200/'

    },

    cache: {

      cacheLocation: BrowserCacheLocation.SessionStorage

    }

  });

}


export function MSALGuardConfigFactory():
  MsalGuardConfiguration {

  return {

    interactionType: InteractionType.Redirect,

    authRequest: {

      scopes: ['openid', 'profile']

    }

  };

}


export function MSALInterceptorConfigFactory():
  MsalInterceptorConfiguration {

  const protectedResourceMap =
    new Map<string, Array<string>>();

  // Exact API endpoint
  protectedResourceMap.set(
    'http://localhost:8080/api/products',
    ['api://13aac3b9-f30a-4689-8f5a-a34fb7c49a3d/Products.Read']
  );

  // Product detail endpoints
  protectedResourceMap.set(
    'http://localhost:8080/api/products/*',
    ['api://13aac3b9-f30a-4689-8f5a-a34fb7c49a3d/Products.Read']
  );

  return {

    interactionType: InteractionType.Redirect,

    protectedResourceMap

  };

}