"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MailOpen } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions")
      .then((res) => res.json())
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-charcoal-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
        Loading submissions...
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-cream-50">
        Submissions
        {submissions.filter((s) => !s.read).length > 0 && (
          <span className="ml-3 inline-block rounded-full bg-oak-600 px-2.5 py-0.5 text-xs text-cream-50">
            {submissions.filter((s) => !s.read).length} new
          </span>
        )}
      </h1>

      {submissions.length === 0 ? (
        <p className="text-charcoal-400">No submissions yet.</p>
      ) : (
        <div className="space-y-2">
          {submissions.map((sub) => (
            <Link
              key={sub.id}
              href={`/admin/submissions/${sub.id}`}
              className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                sub.read
                  ? "border-charcoal-800 bg-charcoal-900 hover:border-charcoal-700"
                  : "border-oak-700/30 bg-oak-500/5 hover:border-oak-700/50"
              }`}
            >
              {sub.read ? (
                <MailOpen className="h-5 w-5 text-charcoal-500" />
              ) : (
                <Mail className="h-5 w-5 text-oak-400" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${sub.read ? "text-cream-200" : "text-cream-50"}`}>
                    {sub.name}
                  </p>
                  <span className="text-xs text-charcoal-500">{sub.email}</span>
                </div>
                <p className="truncate text-sm text-charcoal-400">{sub.message}</p>
              </div>
              <span className="text-xs text-charcoal-500 whitespace-nowrap">
                {new Date(sub.createdAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
