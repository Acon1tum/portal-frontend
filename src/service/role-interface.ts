export enum PermissionName {
  // Business permission (replacing User/Role-related)
  BUSINESS_CREATE = "BUSINESS_CREATE",
  BUSINESS_READ = "BUSINESS_READ",
  BUSINESS_UPDATE = "BUSINESS_UPDATE",
  BUSINESS_DELETE = "BUSINESS_DELETE",
  // Membership permission (replacing Activate/Deactivate)
  MEMBERSHIP_ADD = "MEMBERSHIP_ADD",
  MEMBERSHIP_REMOVE = "MEMBERSHIP_REMOVE",


  // userAccount Permission (replacing Doctor-related)
  ACCOUNT_CREATE = "ACCOUNT_CREATE",
  ACCOUNT_READ = "ACCOUNT_READ",
  ACCOUNT_UPDATE = "ACCOUNT_UPDATE",
  ACCOUNT_DELETE = "ACCOUNT_DELETE",

  // Device permission (replacing Patient/Schedule/Department/Notification)
  DEVICE_CREATE = "DEVICE_CREATE",
  DEVICE_READ = "DEVICE_READ",
  DEVICE_UPDATE = "DEVICE_UPDATE",
  DEVICE_DELETE = "DEVICE_DELETE",

  // System permission (keeping Reports/Settings as is)
  REPORTS_VIEW = "REPORTS_VIEW",
  REPORTS_EXPORT = "REPORTS_EXPORT",
  SETTINGS_MANAGE = "SETTINGS_MANAGE",

  // Post and Comment Permissions
  POST_CREATE = "POST_CREATE",
  POST_EDIT = "POST_EDIT",
  POST_DELETE = "POST_DELETE",
  POST_VIEW = "POST_VIEW",
  COMMENT_CREATE = "COMMENT_CREATE",
  COMMENT_REPLY = "COMMENT_REPLY",
}

export const permissionGroups: Record<string, PermissionName[]> = {
  "Business Permissions": [
    PermissionName.BUSINESS_CREATE,
    PermissionName.BUSINESS_READ,
    PermissionName.BUSINESS_UPDATE,
    PermissionName.BUSINESS_DELETE,
  ],
  "Membership Permissions": [
    PermissionName.MEMBERSHIP_ADD,
    PermissionName.MEMBERSHIP_REMOVE,
  ],
  "Account Permissions": [
    PermissionName.ACCOUNT_CREATE,
    PermissionName.ACCOUNT_READ,
    PermissionName.ACCOUNT_UPDATE,
    PermissionName.ACCOUNT_DELETE,
  ],
  "Device Permissions": [
    PermissionName.DEVICE_CREATE,
    PermissionName.DEVICE_READ,
    PermissionName.DEVICE_UPDATE,
    PermissionName.DEVICE_DELETE,
  ],
  "System Permissions": [
    PermissionName.REPORTS_VIEW,
    PermissionName.REPORTS_EXPORT,
    PermissionName.SETTINGS_MANAGE,
  ],
  "Post and Comment Permissions": [
    PermissionName.POST_CREATE,
    PermissionName.POST_EDIT,
    PermissionName.POST_DELETE,
    PermissionName.POST_VIEW,
    PermissionName.COMMENT_CREATE,
    PermissionName.COMMENT_REPLY,
  ],
};