import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { permissionGroups } from "@/service/role-interface";


interface Permission {
  id: string;
  name: string;
}

interface PermissionPopoverProps {
  permissions: Permission[];
}

const PermissionPopover: React.FC<PermissionPopoverProps> = ({ permissions }) => {
  const [open, setOpen] = useState(false);

  // Function to group permissions based on permissionGroups
  const getGroupedPermissions = () => {
    const grouped: Record<string, string[]> = {};

    // Initialize all groups with empty arrays
    Object.keys(permissionGroups).forEach((group) => {
      grouped[group] = [];
    });

    // Map the provided permissions to their respective groups
    permissions.forEach((perm) => {
      for (const [groupName, groupPermissions] of Object.entries(permissionGroups)) {
        if (groupPermissions.includes(perm.name as any)) {
          grouped[groupName].push(perm.name);
          break; // Assuming each permission belongs to only one group
        }
      }
    });

    // Filter out groups with no permissions
    return Object.entries(grouped).filter(([_, perms]) => perms.length > 0);
  };

  const groupedPermissions = getGroupedPermissions();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <span className="cursor-pointer underline">{permissions.length}</span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="p-4 max-h-96 overflow-y-auto" // Added max height and scroll for long lists
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="space-y-4">
          {groupedPermissions.map(([groupName, perms]) => (
            <div key={groupName}>
              <h4 className="font-semibold text-sm text-gray-700">{groupName}</h4>
              <ul className="ml-4 space-y-1">
                {perms.map((permName) => (
                  <li key={permName} className="text-sm text-gray-600">
                    {permName}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {groupedPermissions.length === 0 && (
            <div className="text-sm text-gray-500">No permissions assigned</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PermissionPopover;