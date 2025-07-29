"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchRoles } from "@/service/roles-and-permissions/roles";
const PermissionPopover = dynamic(() => import("./popover-permission"), {
  ssr: false,
});
import CreateRoleModal from "@/app/modals/manage-user/roles/createRole";
import EditPermissionModal from "@/app/modals/manage-user/roles/edit-permission-modal";
import dynamic from "next/dynamic";

import { Search } from "lucide-react";
import { Plus } from "lucide-react";

interface Role {
  id: string;
  name: string;
  permissions: { id: string; name: string }[];
  users: any[]; // Update this type as needed
}

interface PermissionPopoverProps {
  permissions: { id: string; name: string }[];
}

const UserRole = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
      setFilteredRoles(data);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = roles.filter((role) =>
      role.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredRoles(filtered);
  }, [searchQuery, roles]);


  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRole(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Role Management</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="mb-4 w-1/4">
          <Search className="absolute ml-2 mt-2 h-5 w-5" />
          <input
            type="text"
            placeholder="Search role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end mb-4">
          <CreateRoleModal onRoleCreated={getRoles} />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <PermissionPopover permissions={role.permissions} />
                </TableCell>
                <TableCell>{role.users.length}</TableCell>
                <TableCell>
                  <EditPermissionModal role={role} onUpdate={getRoles} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default UserRole;
