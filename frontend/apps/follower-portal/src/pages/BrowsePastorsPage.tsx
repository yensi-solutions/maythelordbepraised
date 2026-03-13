import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { api, Card, Avatar, Tag, Button } from '@mtlbp/shared';
import type { PastorProfile } from '@mtlbp/shared';

export function BrowsePastorsPage() {
  const [pastors, setPastors] = useState<PastorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<{ pastors: PastorProfile[]; total: number }>('/pastors');
        setPastors(res.data.pastors);
      } catch { /* empty */ }
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <AppLayout>
      <h1 className="font-serif text-3xl font-bold text-brown-dark mb-8">Find a Pastor</h1>
      {isLoading ? (
        <p className="font-sans text-brown-medium">Loading...</p>
      ) : pastors.length === 0 ? (
        <Card><p className="font-sans text-brown-light text-center py-8">No pastors available yet.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastors.map((p) => (
            <Card key={p.id}>
              <div className="text-center">
                <Avatar name={`${p.first_name} ${p.last_name}`} src={p.photo_url} size="lg" className="mx-auto mb-3" />
                <h3 className="font-serif text-lg font-semibold text-brown-dark">{p.first_name} {p.last_name}</h3>
                <p className="font-sans text-brown-medium text-sm">{p.church_name}</p>
                <p className="font-sans text-brown-light text-xs">{p.location}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {p.specialties.map((s) => <Tag key={s}>{s}</Tag>)}
                </div>
                <a href={`/pastors/${p.id}`}>
                  <Button variant="outline" className="mt-4 w-full">View Profile</Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
