"use client";

import { useState, useEffect } from "react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { fetchUsers } from "@/service/manage-user/user";
import PermissionPopover from "../roles-and-permission/popover-permission";
import { Ellipsis } from "lucide-react";
import { Search } from "lucide-react";
import { Plus } from "lucide-react";

import AddUserModal from "@/app/modals/manage-user/addUserModal";

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerCaseQuery) ||
        user.email?.toLowerCase().includes(lowerCaseQuery) ||
        user.role?.name?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="mb-4 w-1/4">
          <Search className="absolute ml-2 mt-2 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* AddUserModal is now self-contained with its own trigger */}
        <AddUserModal />
      </div> 

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name || "N/A"}</TableCell>
                  <TableCell>{user.sex}</TableCell>
                  <TableCell>{user.role?.name || "N/A"}</TableCell>
                  <TableCell>
                    {user.role?.permissions?.length ? (
                      <PermissionPopover permissions={user.role.permissions} />
                    ) : (
                      "0"
                    )}
                  </TableCell>
                  <TableCell>
                    <Ellipsis />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Users;
