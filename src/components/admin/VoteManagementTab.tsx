import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, Users } from 'lucide-react';
import ElectionsTab from './ElectionsTab';
import CandidatesTab from './CandidatesTab';

export default function VoteManagementTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Vote Management</h2>
          <p className="text-muted-foreground">Manage elections, candidates, and voting processes</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="elections" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="elections" className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                Elections
              </TabsTrigger>
              <TabsTrigger value="candidates" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Candidates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="elections">
              <ElectionsTab />
            </TabsContent>

            <TabsContent value="candidates">
              <CandidatesTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}