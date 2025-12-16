import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Upload, 
  X, 
  FileText, 
  CheckCircle,
  Lock,
  AlertTriangle,
  Loader2
} from "lucide-react";

const reportTypes = [
  { value: "academic_dishonesty", label: "Academic Dishonesty" },
  { value: "bribery", label: "Bribery or Corruption" },
  { value: "favoritism", label: "Favoritism or Nepotism" },
  { value: "harassment", label: "Harassment or Discrimination" },
  { value: "misuse_resources", label: "Misuse of University Resources" },
  { value: "conflict_interest", label: "Conflict of Interest" },
  { value: "fraud", label: "Fraud or Financial Misconduct" },
  { value: "other", label: "Other Ethical Violation" },
];

const contactMethods = [
  { value: "none", label: "I prefer to remain completely anonymous" },
  { value: "email", label: "Secure Email" },
  { value: "phone", label: "Phone (We will not record calls)" },
];

export function ReportForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    reportType: "",
    incidentDate: "",
    location: "",
    description: "",
    contactMethod: "none",
    contactInfo: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reportType || !formData.description) {
      toast({
        title: "Required Fields Missing",
        description: "Please select a report type and provide a description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload evidence files if any
      const evidenceUrls: string[] = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(fileName, file);

        if (uploadError) {
          console.error('File upload error:', uploadError);
        } else {
          evidenceUrls.push(fileName);
        }
      }

      // Submit the report
      const { error } = await supabase
        .from('anonymous_reports')
        .insert({
          report_type: formData.reportType,
          incident_date: formData.incidentDate || null,
          location: formData.location || null,
          description: formData.description,
          evidence_urls: evidenceUrls.length > 0 ? evidenceUrls : null,
          contact_method: formData.contactMethod !== "none" ? formData.contactMethod : null,
          contact_info: formData.contactInfo || null,
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Report Submitted Successfully",
        description: "Your anonymous report has been securely submitted. Thank you for helping maintain integrity.",
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border text-center">
        <div className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-forest" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-4">
          Report Submitted Successfully
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Your anonymous report has been securely encrypted and submitted to our confidential review committee. 
          We take every report seriously and will act with discretion.
        </p>
        <div className="bg-cream rounded-xl p-4 inline-flex items-center gap-3 text-sm text-muted-foreground">
          <Shield className="w-5 h-5 text-gold" />
          <span>Your identity remains completely protected</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border">
      {/* Security Notice */}
      <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Lock className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-forest mb-1">Secure Submission</p>
          <p className="text-muted-foreground">
            This form is encrypted. We do not track your IP address or store any identifying information.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Report Type */}
        <div className="space-y-2">
          <Label htmlFor="reportType" className="text-foreground font-medium">
            Type of Incident <span className="text-alert">*</span>
          </Label>
          <Select
            value={formData.reportType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, reportType: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select the type of incident" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Incident Date & Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="incidentDate" className="text-foreground font-medium">
              Date of Incident (Optional)
            </Label>
            <Input
              id="incidentDate"
              type="date"
              value={formData.incidentDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, incidentDate: e.target.value }))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground font-medium">
              Location (Optional)
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Main Campus, Building A"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground font-medium">
            Describe the Incident <span className="text-alert">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Please provide as much detail as possible about what happened, who was involved, and any other relevant information. The more detail you provide, the better we can investigate."
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="min-h-[160px] w-full"
          />
        </div>

        {/* Evidence Upload */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            Upload Evidence (Optional)
          </Label>
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-gold/50 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="evidence-upload"
            />
            <label htmlFor="evidence-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload files or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Images, PDFs, or documents (max 5 files)
              </p>
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2 mt-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-cream rounded-lg px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-forest" />
                    <span className="text-sm text-foreground truncate max-w-[200px]">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-alert transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Method */}
        <div className="space-y-2">
          <Label htmlFor="contactMethod" className="text-foreground font-medium">
            Contact Preference
          </Label>
          <Select
            value={formData.contactMethod}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, contactMethod: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contactMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.contactMethod !== "none" && (
          <div className="space-y-2">
            <Label htmlFor="contactInfo" className="text-foreground font-medium">
              {formData.contactMethod === "email" ? "Secure Email Address" : "Phone Number"}
            </Label>
            <Input
              id="contactInfo"
              type={formData.contactMethod === "email" ? "email" : "tel"}
              placeholder={formData.contactMethod === "email" ? "your-secure-email@example.com" : "+251 XXX XXX XXXX"}
              value={formData.contactInfo}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactInfo: e.target.value }))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              This information is optional and will only be used to follow up on your report if needed.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="alert"
            size="lg"
            className="w-full gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Encrypting & Submitting...
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                Submit Anonymous Report
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            By submitting, you confirm that this report is made in good faith.
          </p>
        </div>
      </div>
    </form>
  );
}
