mo-app manifest
=====================

## Introduction

We use `app.json` file in project root to detect if it's a mo-app or
not. `app.json` contain various properties:

* name: "string" application name
* version: "string" application version
* main: "string" main entry file [not implemented yet]
* module: "amd" | "umd" [depreceated]
* license: "string" [depreceated] define it in package.json
* ignore: Array of ["strings"] ignore file
* configurable: true | false [default: false]
* config: object [optional]
    * inputData: object
        * example: example JSON data file path
        * parameter: 'input'
    * locales: object with locale information
        * available: ['en_US', 'nb_NO'] ISO format (first one is
          default)
        * parameter: 'locale'
    * options: Array of option objects
        * name: 'string'
        * description: 'string'
        * parameter: 'theme'
    * webComponent: object [not implemented yet]
        * tagName: "string" "my-custom-tag"
        * file: "custom-tag.html"

## Recommened
MO apps should also implement W3C [web app
manifest](https://www.w3.org/TR/appmanifest/) there is a nice node tool
for [this](https://www.npmjs.com/package/pwa-manifest-cli). This way we
can also pull out icon files into admin UI.

## Configurable apps
By default all apps developed in MO are non configurable apps. Which
means app does not accept any input paramenters either in URI or during
initalization (in case of web components). However, we do need
configurable apps for following reasons:

* Write once and use everywhere.
* Possibility to use it with different input data and configuration.
* Let production configure app and IT develops it.

Configurable apps should set few options inside `app.json` or
`mo-app.json` file.

```
{
  ...
  "configurable": true,
  "config": {
    "inputData": {
      "example": "data.json", // example data file or default data file
      "parameter: "data" // URI get parameter name for input data
    },
    "locale": {
      "available": ["en_US", "nb_NO"],
      "parameter: "lang" // URI get paramenter name for locale
    },
    "options": [
      {
        "name": "theme",
        "description":"sets theme for this app",
        "parameter": "theme"
      }
     ]
  }
  ...
}
```
