import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentRequestCard from "./StudentRequestCard";


const RequestTabs = ({ requests, onApprove, onDecline }) => {
  const currentRequests = requests.filter(req => req.status === 'pending');
  const previousRequests = requests.filter(req => req.status !== 'pending');

  return (
    <Tabs defaultValue="current" className="w-full">
      <TabsList className="mb-6 bg-gray-100/70 p-1">
        <TabsTrigger 
          value="current" 
          className="relative px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Current Requests
          {currentRequests.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-school-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {currentRequests.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="previous" 
          className="relative px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Previous Requests
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="current" className="space-y-4">
        {currentRequests.length > 0 ? (
          currentRequests.map(request => (
            <StudentRequestCard 
              key={request.id} 
              request={request} 
              onApprove={onApprove} 
              onDecline={onDecline} 
            />
          ))
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-muted-foreground">No pending requests at the moment.</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="previous" className="space-y-4">
        {previousRequests.length > 0 ? (
          previousRequests.map(request => (
            <StudentRequestCard 
              key={request.id} 
              request={request} 
              onApprove={onApprove} 
              onDecline={onDecline} 
            />
          ))
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-muted-foreground">No previous requests found.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default RequestTabs;
