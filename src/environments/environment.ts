// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: '开发环境中.........................',
  loginUrl: 'http://120.78.156.30:8848/cloud_house_authentication',
  // chargeUrl: 'http://120.78.156.30:8849/cloud_house_interactive',
  chargeUrl: 'http://192.168.28.139:8849/cloud_house_interactive',
  sysetUrl: 'http://120.78.156.30:8847/cloud_house_admin',
  // sysetUrl: 'http://192.168.28.236:8847/cloud_house_admin',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
