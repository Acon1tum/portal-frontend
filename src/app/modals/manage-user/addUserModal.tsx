"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/service/manage-user/createUser";
import { fetchRoles } from "@/service/roles-and-permissions/roles";
import { Plus } from "lucide-react";

interface Role {
  id: string;
  name: string;
}

const AddUserModal = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");

  // Fetch roles on component mount
  useEffect(() => {
    const getRoles = async () => {
      try {
        const data = await fetchRoles();
        setRoles(data);
      } catch (error) {
        console.error("Failed to load roles:", error);
      }
    };

    getRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate sex input: only "male" or "female" are supported based on your schema
    if (!["male", "female"].includes(sex.toLowerCase())) {
      alert("Please select either Male or Female.");
      return;
    }

    if (!selectedRole) {
      alert("Please select a role.");
      return;
    }

    // Get the role object for the selected role and extract its name
    const selectedRoleObj = roles.find((role) => role.id === selectedRole);
    const selectedRoleName = selectedRoleObj ? selectedRoleObj.name : "";

    // Construct the user data with the selected roleName as accountId
    const userData = {
      email,
      name,
      sex: sex.toUpperCase() as "MALE" | "FEMALE",
      roleId: selectedRole,
      account: {
        accountId: selectedRoleName, // Using the role name
        providerId: "provider1", // Replace with the actual provider ID if available
        password,
      },
    };

    try {
      const newUser = await createUser(userData);
      console.log("User created successfully:", newUser);
      setOpen(false);
      // Reset form fields
      setEmail("");
      setName("");
      setSex("");
      setPassword("");
      setSelectedRole("");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred while creating the user.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />

          Add User
        </Button>
      </DialogTrigger>
      <DialogContent
        className="rounded-lg shadow-lg p-6 
        data-[state=open]:animate-in 
        data-[state=open]:fade-in-0 
        data-[state=open]:zoom-in-95
        data-[state=closed]:animate-out 
        data-[state=closed]:fade-out-0 
        data-[state=closed]:zoom-out-95
        duration-300"
      >
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="sex">Sex</Label>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
