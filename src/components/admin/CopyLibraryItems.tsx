
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, Copy } from "lucide-react";
import { searchUsers, copyLibraryItems } from "@/services/adminService";

type User = {
  id: string;
  email: string;
  lastSignIn: string | null;
  createdAt: string;
};

export const CopyLibraryItems = () => {
  const [sourceEmail, setSourceEmail] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [sourceUsers, setSourceUsers] = useState<User[]>([]);
  const [targetUsers, setTargetUsers] = useState<User[]>([]);
  const [selectedSourceUser, setSelectedSourceUser] = useState<User | null>(null);
  const [selectedTargetUser, setSelectedTargetUser] = useState<User | null>(null);
  const [isSearchingSource, setIsSearchingSource] = useState(false);
  const [isSearchingTarget, setIsSearchingTarget] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const { toast } = useToast();

  const handleSearchUsers = async (email: string, isSource: boolean) => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email to search for users.",
        variant: "destructive",
      });
      return;
    }

    if (isSource) {
      setIsSearchingSource(true);
    } else {
      setIsSearchingTarget(true);
    }

    try {
      const result = await searchUsers(email);
      
      if (!result.success) {
        toast({
          title: "Error searching users",
          description: result.error || "Failed to search for users.",
          variant: "destructive",
        });
        return;
      }

      if (isSource) {
        setSourceUsers(result.users);
        setSelectedSourceUser(null);
      } else {
        setTargetUsers(result.users);
        setSelectedTargetUser(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while searching for users.",
        variant: "destructive",
      });
    } finally {
      if (isSource) {
        setIsSearchingSource(false);
      } else {
        setIsSearchingTarget(false);
      }
    }
  };

  const handleCopyItems = async () => {
    if (!selectedSourceUser || !selectedTargetUser) {
      toast({
        title: "Users required",
        description: "Please select both source and target users.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSourceUser.id === selectedTargetUser.id) {
      toast({
        title: "Invalid selection",
        description: "Source and target users cannot be the same.",
        variant: "destructive",
      });
      return;
    }

    setIsCopying(true);
    setResult(null);

    try {
      const result = await copyLibraryItems(selectedSourceUser.id, selectedTargetUser.id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `${result.count} items copied from ${selectedSourceUser.email} to ${selectedTargetUser.email}.`,
        });
      } else {
        toast({
          title: "Error copying items",
          description: result.error || "Failed to copy library items.",
          variant: "destructive",
        });
      }
      
      setResult({
        success: result.success,
        message: result.success
          ? `Successfully copied ${result.count} of ${result.sourceCount} items from ${selectedSourceUser.email} to ${selectedTargetUser.email}.`
          : `Failed to copy items: ${result.error}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while copying library items.",
        variant: "destructive",
      });
      setResult({
        success: false,
        message: "An unexpected error occurred while copying library items."
      });
    } finally {
      setIsCopying(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-sm border">
      <div>
        <h2 className="text-2xl font-bold mb-6">Copy Library Items</h2>
        <p className="text-gray-500 mb-4">
          Use this tool to copy all library items from one user to another user.
        </p>
      </div>

      {/* Source User Selection */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Source User (Copy FROM)</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="source-email">Email</Label>
            <Input
              id="source-email"
              value={sourceEmail}
              onChange={(e) => setSourceEmail(e.target.value)}
              placeholder="Search by email"
            />
          </div>
          <div className="self-end">
            <Button 
              onClick={() => handleSearchUsers(sourceEmail, true)} 
              disabled={isSearchingSource}
            >
              {isSearchingSource ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </div>

        {sourceUsers.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sign In</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sourceUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={selectedSourceUser?.id === user.id ? "bg-blue-50" : ""}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(user.lastSignIn)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSourceUser(user)}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedSourceUser && (
          <Alert>
            <AlertDescription>
              Selected source user: <strong>{selectedSourceUser.email}</strong>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Target User Selection */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Target User (Copy TO)</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="target-email">Email</Label>
            <Input
              id="target-email"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="Search by email"
            />
          </div>
          <div className="self-end">
            <Button 
              onClick={() => handleSearchUsers(targetEmail, false)} 
              disabled={isSearchingTarget}
            >
              {isSearchingTarget ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </div>

        {targetUsers.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sign In</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {targetUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={selectedTargetUser?.id === user.id ? "bg-blue-50" : ""}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(user.lastSignIn)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTargetUser(user)}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTargetUser && (
          <Alert>
            <AlertDescription>
              Selected target user: <strong>{selectedTargetUser.email}</strong>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Copy Action */}
      <div className="pt-4 border-t">
        <Button 
          className="w-full"
          onClick={handleCopyItems}
          disabled={isCopying || !selectedSourceUser || !selectedTargetUser}
        >
          {isCopying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Copying Items...
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Library Items
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          <AlertDescription>
            {result.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
