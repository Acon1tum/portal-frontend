import { User, Mail, Phone, MapPin, Calendar, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserType, UserRole, UserType as UserTypeEnum, CurrentJobStatus } from "@/utils/types";
import { useRouter } from "next/navigation";
import { navigateToChatWithUser } from "@/utils/chat-utils";

interface OverviewTabProps {
  user: UserType;
}

export default function OverviewTab({ user }: OverviewTabProps) {
  const router = useRouter();

  const handleMessageClick = () => {
    navigateToChatWithUser(user, router);
  };

  const getRoleColor = (role: UserRole) => {
    const roleColors = {
      [UserRole.VISITOR]: "bg-blue-100 text-blue-800",
      [UserRole.JOBSEEKER]: "bg-green-100 text-green-800",
      [UserRole.MANNING_AGENCY]: "bg-purple-100 text-purple-800",
      [UserRole.SUPERADMIN]: "bg-red-100 text-red-800",
      [UserRole.EXHIBITOR]: "bg-orange-100 text-orange-800",
      [UserRole.SPONSOR]: "bg-yellow-100 text-yellow-800",
    };
    return roleColors[role] || "bg-gray-100 text-gray-800";
  };

  const getJobStatusColor = (status: CurrentJobStatus) => {
    const statusColors = {
      [CurrentJobStatus.ACTIVELY_LOOKING]: "bg-green-100 text-green-800",
      [CurrentJobStatus.OPEN_TO_OFFERS]: "bg-yellow-100 text-yellow-800",
      [CurrentJobStatus.NOT_LOOKING]: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg font-semibold">{user.name || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-lg">{user.email}</p>
                {user.isEmailVerified ? (
                  <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 ml-2 text-yellow-600" />
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <Badge className={`mt-1 ${getRoleColor(user.role)}`}>
                {user.role.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">User Type</label>
              <p className="text-lg">{user.userType ? user.userType.replace(/_/g, ' ') : "Not specified"}</p>
            </div>
            {user.currentJobStatus && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Job Status</label>
                <Badge className={`mt-1 ${getJobStatusColor(user.currentJobStatus)}`}>
                  {user.currentJobStatus.replace(/_/g, ' ')}
                </Badge>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <p className="text-lg">{user.sex || "Not specified"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Account details and verification status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Verification</label>
              <div className="flex items-center mt-1">
                {user.isEmailVerified ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-green-600">Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                    <span className="text-yellow-600">Not Verified</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Status</label>
              <Badge variant="outline" className="mt-1">
                Active
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="text-lg">Recently joined</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Associated Business */}
      {user.organization && (
        <Card>
          <CardHeader>
            <CardTitle>Associated Business</CardTitle>
            <CardDescription>Business profile linked to this user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                {user.organization.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold">{user.organization.name}</h3>
                <p className="text-sm text-muted-foreground">{user.organization.industry}</p>
                <p className="text-sm text-muted-foreground">{user.organization.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common actions for this user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={handleMessageClick}
              className="p-4 border rounded-lg hover:bg-muted transition-colors text-left"
            >
              <MessageSquare className="h-5 w-5 mb-2 text-primary" />
              <h3 className="font-medium">Send Message</h3>
              <p className="text-sm text-muted-foreground">Contact this user</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
              <CheckCircle className="h-5 w-5 mb-2 text-primary" />
              <h3 className="font-medium">Verify Account</h3>
              <p className="text-sm text-muted-foreground">Verify user identity</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
