MoApp tool
=================================
MoApp tool provides a commandline interface to create and manage moapps.

Install
=================================
npm link
OR
npm install -g @mo-platform/cli@next


API Spec
=================================
1. login
2. deploy
3. delete
4. search
5. info
6. version
7. help
8. login

`login`

Login a user to register or unregister an app.
```
moapp login
```

`deploy`

Uploads and deploy app on server.
```
moapp deploy <package> <url>
```

`delete`

Remove package from app registry on server.
```
moapp delete <package>
```

`search`

Search packages on server.
```
moapp search <expression>
```

`info`

Display app info from package name.
```
moapp info <package>
```

`version` (removed)

Please use `npm version` command

`help`

Display help information.

`login`

Login into MoJS SDK

```
moapp login
```
