## Plan for adding permissions for CORPORATE_PROFESSIONAL UserType and other users

1.  **Analyze Existing Permission System:**
    *   I will start by thoroughly examining the existing codebase to identify the current permission and access control system. I will look for:
        *   How different user roles and types are handled.
        *   How permissions are defined and checked.
        *   How components are rendered based on user permissions.
        *   Specifically, I will investigate `src/service/roleGuard.tsx` and the sidebar component in `src/components/custom-ui/sidebar/` to understand the current implementation.

2.  **Refine the `UserRole` and `UserType` Enums:**
    *   Based on the analysis, I will determine the best way to incorporate the `CORPORATE_PROFESSIONAL` user type into the permission system. This might involve:
        *   Adding a new `CORPORATE_PROFESSIONAL` role to the `UserRole` enum in `src/utils/types.ts`.
        *   Creating a mapping between `UserType` and `UserRole`.
        *   Or, if the system is more flexible, using the `UserType` directly for permission checks.

3.  **Implement Granular Permissions for Post Management and Comments:**
    *   I will define a new set of permissions in `src/utils/types.ts` under the `PermissionName` enum. These permissions will include:
        *   `POST_CREATE`
        *   `POST_EDIT`
        *   `POST_DELETE`
        *   `POST_VIEW`
        *   `COMMENT_CREATE`
        *   `COMMENT_REPLY`
    *   I will then associate these permissions with different user roles. For example:
        *   `CORPORATE_PROFESSIONAL` will have `POST_CREATE`, `POST_EDIT`, `POST_DELETE`, `POST_VIEW`, `COMMENT_CREATE`, and `COMMENT_REPLY`.
        *   Other user types will have `POST_VIEW`, `COMMENT_CREATE`, and `COMMENT_REPLY`.

4.  **Update Components to Enforce Permissions:**
    *   **Post Management Page:**
        *   I will modify the post management page to conditionally render the "Create Post", "Edit Post", and "Delete Post" buttons based on the user's permissions. Only `CORPORATE_PROFESSIONAL` will see these buttons.
        *   All users will be able to view posts.
        *   I will add checks in the corresponding API service calls (`src/service/postingService.ts`) to prevent unauthorized actions on the frontend.
    *   **Post Viewing Page (or component):**
        *   I will ensure that all users can view the posts.
        *   I will add a comment section where users can add comments and reply to existing comments.
    *   **Profile Page:**
        *   I will ensure that all users can view and update their own profile information.
    *   **Sidebar:**
        *   I will create a new `CorporateProfessionalSidebar` component with links to the dashboard, post management, and profile pages.
        *   I will update the `SidebarWrapper` component in `src/components/custom-ui/sidebar/sidebar-main.tsx` to only render the `CorporateProfessionalSidebar` if the user's role is `CORPORATE_PROFESSIONAL`. For all other user roles, the sidebar will not be rendered.
    *   **Dashboard:**
        *   I will ensure that the dashboard (`src/app/(dashboard)/dashboard/page.tsx`) is accessible to the `CORPORATE_PROFESSIONAL` user type.

5.  **Backend Changes (Assumption):**
    *   This plan focuses on the frontend changes. However, it's important to note that the backend will also need to be updated to enforce these new permissions at the API level. This includes:
        *   Updating the backend to recognize the new permissions.
        *   Updating the post management API endpoints to check for the `POST_CREATE`, `POST_EDIT`, and `POST_DELETE` permissions before processing requests.
        *   Updating the comment API endpoints to check for the `COMMENT_CREATE` and `COMMENT_REPLY` permissions.