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
  title?: string;
  reportType: string;
  description: string;
  incidentDate: any | null;
  location: string | null;
  contactMethod: string | null;
  contactInfo: string | null;
  evidenceUrls: string[] | null;
  attachments?: string[] | null;
  status: string;
  priority?: string;
  category?: string;
  internalNotes: string | null;
  adminNotes?: string | null;
  sessionId?: string;
  submittedAt?: any;
  createdAt: any;
  updatedAt?: any;
  reviewedAt?: any;
  reviewedBy?: string;
  // Legacy support fields
  report_type?: string;
  incident_date?: any;
  contact_method?: string;
  contact_info?: string;
  evidence_urls?: string[];
  created_at?: any;
  internal_notes?: string;
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
      console.log('🔍 Fetching reports from Firestore...');
      const data = await FirestoreService.getAll(Collections.REPORTS);
      console.log('📊 Raw reports data:', data);
      
      const mappedReports = data.map((item: any) => ({
        ...item,
        title: item.title || `${(item.reportType || item.report_type || 'other').replace('_', ' ')} Report`,
        reportType: item.reportType || item.report_type || 'other',
        incidentDate: item.incidentDate || item.incident_date || null,
        contactMethod: item.contactMethod || item.contact_method || 'none',
        contactInfo: item.contactInfo || item.contact_info || null,
        evidenceUrls: item.evidenceUrls || item.evidence_urls || item.attachments || null,
        internalNotes: item.internalNotes || item.internal_notes || item.adminNotes || null,
        createdAt: item.createdAt || item.created_at || item.submittedAt || null,
        priority: item.priority || 'medium',
        category: item.category || item.reportType || item.report_type || 'other',
      }));
      
      // Sort by creation date (newest first)
      const sortedReports = mappedReports.sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log('✅ Processed reports:', sortedReports);
      setReports(sortedReports as Report[]);
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      toast.error('Failed to fetch reports: ' + (error as Error).message);
    }
    setIsLoading(false);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;
    setIsUpdating(true);

    try {
      await FirestoreService.update(Collections.REPORTS, selectedReport.id, {
        status: newStatus || selectedReport.status,
        internalNotes: internalNotes,
        reviewedAt: new Date(),
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
    setInternalNotes(report.internalNotes || '');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Anonymous Reports</h2>
        <Badge variant="outline" className="w-fit">{reports.length} total</Badge>
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
                    <CardTitle className="text-lg">
                      {report.title || `${(report.reportType || '').replace('_', ' ')} Report`}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>
                        {report.createdAt ? (
                          format(
                            report.createdAt.seconds 
                              ? new Date(report.createdAt.seconds * 1000) 
                              : new Date(report.createdAt), 
                            'PPP p'
                          )
                        ) : 'No date'}
                      </span>
                      {report.priority && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{report.priority} Priority</span>
                        </>
                      )}
                    </div>
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
                  {report.incidentDate && (
                    <span>
                      Incident: {format(
                        report.incidentDate.seconds 
                          ? new Date(report.incidentDate.seconds * 1000) 
                          : new Date(report.incidentDate), 
                        'PP'
                      )}
                    </span>
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
                        {(report.reportType || '').replace('_', ' ')} Report
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
                      {report.incidentDate && (
                        <div>
                          <h4 className="font-medium mb-1">Incident Date</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              report.incidentDate.seconds ? new Date(report.incidentDate.seconds * 1000) : new Date(report.incidentDate), 
                              'PPP'
                            )}
                          </p>
                        </div>
                      )}
                      {report.location && (
                        <div>
                          <h4 className="font-medium mb-1">Location</h4>
                          <p className="text-sm text-muted-foreground">{report.location}</p>
                        </div>
                      )}
                      {report.contactMethod && report.contactMethod !== 'none' && (
                        <div>
                          <h4 className="font-medium mb-1">Contact Preference</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {report.contactMethod}: {report.contactInfo}
                          </p>
                        </div>
                      )}
                      {report.evidenceUrls && report.evidenceUrls.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Evidence Files</h4>
                          <div className="flex flex-wrap gap-2">
                            {report.evidenceUrls.map((url, idx) => (
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
