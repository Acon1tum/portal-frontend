## Plan to fix Login Error Handling

1.  **Modify `src/components/custom-ui/auth/Login.tsx`:**
    *   Import the `toast` function from the `sonner` library.
    *   In the `handleSubmit` function, within the `catch` block, replace the existing `setError` call with a call to `toast.error()` to display the error message from the authentication service.
    *   Remove the now-unnecessary `error` state and the JSX element that displays the error message.

This change will replace the simple text-based error message with a more user-friendly toast notification when a login attempt fails due to "Access denied" or other errors.