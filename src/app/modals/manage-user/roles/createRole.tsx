"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createRole } from "@/service/roles-and-permissions/createRole";
import AlertModal from "../../shared/alertModal";
import { Plus } from "lucide-react";

// Import your grouped permissions
import { permissionGroups } from "@/service/role-interface";

interface CreateRoleModalProps {
  onRoleCreated: () => void;
}

export default function CreateRoleModal({
  onRoleCreated,
}: CreateRoleModalProps) {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        // If not all are checked, add the missing ones
        const newPermissions = permsInGroup.filter((p) => !prev.includes(p));
        return [...prev, ...newPermissions];
      }
    });
  };

  // Create role on confirm
  const handleRoleCreation = async () => {
    setLoading(true);
    setError("");

    try {
      await createRole({
        name: roleName,
        permissionNames: selectedPermissions,
      });

      onRoleCreated(); // callback to refresh roles in parent, etc.
      setOpen(false);
      setRoleName("");
      setSelectedPermissions([]);
    } catch (err: any) {
      setError(err.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Plus size={16} /> <span>Create Role</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="rounded-lg shadow-lg
        data-[state=open]:animate-in 
        data-[state=open]:fade-in-0 
        data-[state=open]:zoom-in-95
        data-[state=closed]:animate-out 
        data-[state=closed]:fade-out-0 
        data-[state=closed]:zoom-out-95
        duration-300"
      >
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Enter the role name and select the permissions below.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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

          {/* Scrollable Permissions with a group-level checkbox */}
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

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Footer with AlertModal */}
          <DialogFooter className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRoleCreation}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
