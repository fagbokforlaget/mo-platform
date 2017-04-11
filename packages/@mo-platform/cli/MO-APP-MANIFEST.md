mo-app manifest
=====================

We use `app.json` file in project root to detect if it's a mo-app or
not. `app.json` contain various properties:

* name: "string" application name
* version: "string" application version
* main: "string" main entry file [not implemented yet]
* module: "amd" | "umd" [depreceated]
* license: "string" [depreceated] define it in package.json
* ignore": Array of ["strings"] ignore file
* embed: object [optional]
  * inputData: object
    * example: example JSON data file path
    * parameter: 'input'
  * webComponent: object [not implemented yet]
    * tagName: "string" "my-custom-tag"
    * file: "custom-tag.html"
  * locales: object with locale information
    * available: ['en_US', 'nb_NO'] ISO format
    * parameter: 'locale'
  * themes:
    * available: ['moonLight', 'dark', 'light'] etc
    * parameter: 'theme'
