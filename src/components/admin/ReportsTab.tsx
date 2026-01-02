import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye, Loader2, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Report {
  id: string;
  report_type: string;
  description: string;
  incident_date: any | null;
  location: string | null;
  contact_method: string | null;
  contact_info: string | null;
  evidence_urls: string[] | null;
  status: string;
  internal_notes: string | null;
  created_at: any;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewing: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  dismissed: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  reviewing: <Eye className="h-3 w-3" />,
  resolved: <CheckCircle className="h-3 w-3" />,
  dismissed: <XCircle className="h-3 w-3" />,
};

export default function ReportsTab() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.REPORTS);
      setReports(data as Report[]);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    }
    setIsLoading(false);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;
    setIsUpdating(true);

    try {
      await FirestoreService.update(Collections.REPORTS, selectedReport.id, {
        status: newStatus || selectedReport.status,
        internal_notes: internalNotes,
        reviewed_at: new Date(),
      });
      toast.success('Report updated successfully');
      fetchReports();
      setSelectedReport(null);
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    }
    setIsUpdating(false);
  };

  const openReportDialog = (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setInternalNotes(report.internal_notes || '');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Anonymous Reports</h2>
        <Badge variant="outline">{reports.length} total</Badge>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reports submitted yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg capitalize">{report.report_type.replace('_', ' ')}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(report.created_at), 'PPP p')}
                    </p>
                  </div>
                  <Badge className={statusColors[report.status]}>
                    <span className="flex items-center gap-1">
                      {statusIcons[report.status]}
                      {report.status}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground line-clamp-2 mb-4">
                  {report.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  {report.incident_date && (
                    <span>Incident: {format(new Date(report.incident_date), 'PP')}</span>
                  )}
                  {report.location && <span>• {report.location}</span>}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => openReportDialog(report)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="capitalize">
                        {report.report_type.replace('_', ' ')} Report
                      </DialogTitle>
                      <DialogDescription>
                        View detailed information about this anonymous report.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-medium mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {report.description}
                        </p>
                      </div>
                      {report.incident_date && (
                        <div>
                          <h4 className="font-medium mb-1">Incident Date</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(report.incident_date), 'PPP')}
                          </p>
                        </div>
                      )}
                      {report.location && (
                        <div>
                          <h4 className="font-medium mb-1">Location</h4>
                          <p className="text-sm text-muted-foreground">{report.location}</p>
                        </div>
                      )}
                      {report.contact_method && report.contact_method !== 'none' && (
                        <div>
                          <h4 className="font-medium mb-1">Contact Preference</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {report.contact_method}: {report.contact_info}
                          </p>
                        </div>
                      )}
                      {report.evidence_urls && report.evidence_urls.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Evidence Files</h4>
                          <div className="flex flex-wrap gap-2">
                            {report.evidence_urls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                File {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Update Status</h4>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="dismissed">Dismissed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Internal Notes</h4>
                        <Textarea
                          value={internalNotes}
                          onChange={(e) => setInternalNotes(e.target.value)}
                          placeholder="Add internal notes (not visible to reporter)"
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleUpdateReport} disabled={isUpdating} className="w-full">
                        {isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
