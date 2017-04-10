Appo tool
=================================
Appo tool provides a commandline interface to create and manage moapps.

Install
=================================
npm link
OR
npm install -g appo [not available yet]


API Spec
=================================
1. init
2. login
3. deploy
4. delete
5. search
6. info
7. version
8. help
9. login

`init`

Creates app.json file interactively.
```
appo init
```

`login`

Login a user to register or unregister an app.
```
appo login
```

`deploy`

Uploads and deploy app on server.
```
appo deploy <package> <url>
```

`delete`

Remove package from app registry on server.
```
appo delete <package>
```

`search`

Search packages on server.
```
appo search <expression>
```

`info`

Display app info from package name.
```
appo info <package>
```

`version`

Run this in a package directory to bump the version and write the new data back to the app.json file.

```
appo version [<newversion> | major | minor | patch]
```

`help`

Display help information.

`login`

Login into MoJS SDK

```
appo login
```