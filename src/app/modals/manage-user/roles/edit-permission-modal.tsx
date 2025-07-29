"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { editRole } from "@/service/roles-and-permissions/editRole";
import AlertModal from "../../shared/alertModal";
import { permissionGroups } from "@/service/role-interface";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface EditPermissionModalProps {
  role: {
    id: string;
    name: string;
    permissions: { id: string; name: string }[];
    users: any[];
  };
  onUpdate?: () => void;
}

export default function EditPermissionModal({
  role,
  onUpdate,
}: EditPermissionModalProps) {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState(role.name);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize roleName and selectedPermissions when the modal opens
    if (open) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions.map((perm) => perm.name));
    }
  }, [open, role]);

  // Toggle an individual permission
  const handleCheckboxChange = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((perm) => perm !== permission)
        : [...prev, permission]
    );
  };

  // Toggle ALL permissions in a group
  const handleGroupCheckboxChange = (
    permsInGroup: string[],
    allChecked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      if (allChecked) {
        // If currently all are checked, remove them from selectedPermissions
        return prev.filter((perm) => !permsInGroup.includes(perm));
      } else {
        // If not all are checked, add any missing ones
        const newPermissions = permsInGroup.filter((p) => !prev.includes(p));
        return [...prev, ...newPermissions];
      }
    });
  };

  const confirmSaveRole = async () => {
    setLoading(true);
    setError("");
    try {
      // Update the role on the backend
      await editRole(role.id, {
        name: roleName,
        permissionNames: selectedPermissions,
      });
      // If onUpdate callback provided, call it to refresh any parent data
      onUpdate?.();
      setOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-2xl rounded-lg shadow-lg
        data-[state=open]:animate-in 
        data-[state=open]:fade-in-0 
        data-[state=open]:zoom-in-95
        data-[state=closed]:animate-out 
        data-[state=closed]:fade-out-0 
        data-[state=closed]:zoom-out-95
        duration-300"
      >
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the role name and select permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Role Name */}
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>

          {/* Permissions with scrollable container */}
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="max-h-64 overflow-y-auto space-y-4 border rounded p-2">
              {Object.entries(permissionGroups).map(([groupTitle, perms]) => {
                // Determine if all or some of the group's permissions are selected
                const allChecked = perms.every((p) =>
                  selectedPermissions.includes(p)
                );
                const someChecked = perms.some((p) =>
                  selectedPermissions.includes(p)
                );

                return (
                  <div
                    key={groupTitle}
                    className="border p-3 rounded-md space-y-2"
                  >
                    {/* Group Title & Group Checkbox */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        className="border-2 border-muted-foreground/50"
                        id={`group-${groupTitle}`}
                        checked={allChecked}
                        onCheckedChange={() =>
                          handleGroupCheckboxChange(perms, allChecked)
                        }
                        {...(someChecked && { "data-state": "indeterminate" })}
                      />
                      <Label
                        htmlFor={`group-${groupTitle}`}
                        className="font-semibold"
                      >
                        {groupTitle}
                      </Label>
                    </div>

                    {/* Individual permissions in group */}
                    <div className="flex flex-wrap gap-4">
                      {perms.map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`perm-${permission}`}
                            checked={selectedPermissions.includes(permission)}
                            onCheckedChange={() =>
                              handleCheckboxChange(permission)
                            }
                          />
                          <Label
                            htmlFor={`perm-${permission}`}
                            className="text-sm"
                          >
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Footer buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={confirmSaveRole} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
