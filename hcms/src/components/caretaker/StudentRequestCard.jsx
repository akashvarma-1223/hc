import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-Toast";
import { Check, X, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";


const StudentRequestCard = ({ request, onApprove, onDecline }) => {
  const { toast } = useToast();
  console.log(request);

  const handleApprove = () => {
    onApprove(request.id);
    toast({
      title: "Request Approved",
      description: `${request.username}'s late entry request has been approved.`,
    });
  };

  const handleDecline = () => {
    onDecline(request.id);
    toast({
      title: "Request Declined",
      description: `${request.username}'s late entry request has been declined.`,
    });
  };

  const handleViewAttachment = () => {
    window.open(`http://localhost:5000/api/late-entry/${request.id}/attachment`, "_blank");
  };

  return (
    <Card className="w-full mb-4 overflow-hidden animate-fade-in border-l-4 hover:shadow-md transition-all duration-200 border-l-school-primary">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">{request.username}</h3>
              <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-md">
                {request.student_id}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(request.timestamp.replace(" ", "T")), "dd/MM/yyyy hh:mma")}
            </p>

            {request.reason && (
              <p className="mt-2 text-sm bg-gray-50 p-3 rounded-md border border-gray-100">
                Reason: "{request.reason}"
              </p>
            )}
          </div>

          <div>
            {request.status === 'pending' ? (
              <Badge variant="outline" className="bg-school-pending/10 text-school-pending border-school-pending/20">
                Pending
              </Badge>
            ) : request.status === 'approved' ? (
              <Badge variant="outline" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-md">
                Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-md">
                Declined
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      {request.status === 'pending' && (
        <CardFooter className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
          {request.attachment && (
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-md"
              onClick={handleViewAttachment}
            >
              <FileText className="mr-2 h-4 w-4" /> View Attachment
            </Button>
          )}
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-md"
            onClick={handleDecline}
          >
            <X className="mr-2 h-4 w-4" /> Decline
          </Button>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-md"
            onClick={handleApprove}
          >
            <Check className="mr-2 h-4 w-4" /> Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default StudentRequestCard;
