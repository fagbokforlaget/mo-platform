export default class User {
  constructor(
    provider,
    id,
    email,
    displayName,
    className,
    classLevel,
    firstName,
    lastName,
    institutionId,
    role,
    roleId,
    username) {
    this.provider = provider;
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.classLevel = classLevel;
    this.firstName = firstName;
    this.lastName = lastName;
    this.institutionId = institutionId;
    this.role = role;
    this.roleId = roleId;
    this.username = username;
  }

  toString() {
    return this.displayName;
  }
}
