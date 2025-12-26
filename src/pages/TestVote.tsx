import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { where } from 'firebase/firestore';

export default function TestVote() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testFirebase() {
      try {
        console.log('🔍 Testing Firebase connection...');
        
        // Test elections
        const elections = await FirestoreService.getAll(Collections.ELECTIONS);
        console.log('📊 All elections:', elections);
        
        // Test open elections
        const openElections = await FirestoreService.getAll(Collections.ELECTIONS, [
          where('status', '==', 'open')
        ]);
        console.log('🗳️ Open elections:', openElections);
        
        if (openElections.length > 0) {
          const election = openElections[0];
          console.log('✅ Current election:', election);
          
          // Test candidates
          const candidates = await FirestoreService.getAll(Collections.CANDIDATES, [
            where('electionId', '==', election.id)
          ]);
          console.log('👥 Candidates:', candidates);
          
          setData({
            elections,
            openElections,
            currentElection: election,
            candidates
          });
        } else {
          setData({ elections, openElections: [], currentElection: null, candidates: [] });
        }
        
      } catch (err) {
        console.error('❌ Firebase test error:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    
    testFirebase();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Firebase Test</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Firebase Test</h1>
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Test Results</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">All Elections ({data?.elections?.length || 0})</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(data?.elections, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Open Elections ({data?.openElections?.length || 0})</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(data?.openElections, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Current Election</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(data?.currentElection, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Candidates ({data?.candidates?.length || 0})</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(data?.candidates, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}