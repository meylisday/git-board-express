import { ManagementClient } from 'auth0';

export const auth0 = new ManagementClient({
  domain: 'dev-7-1p73ta.eu.auth0.com',
  clientId: 'sSXznTp3RoYjCyp1C3kuq6mCR8gT5LXP',
  clientSecret: 'Xzb-Iu_YyMjn-MrpmUDGGOaYkUwOTJEpseHlRJWR4Wxo2y3uBoMjg5y-X_f6OO3W',
  audience: "https://dev-7-1p73ta.eu.auth0.com/api/v2/",
})