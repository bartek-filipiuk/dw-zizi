"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/submissions/${params.id}`)
      .then((res) => res.json())
      .then(setSubmission)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    await fetch(`/api/submissions/${params.id}`, { method: "DELETE" });
    router.push("/admin/submissions");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-charcoal-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
        Loading...
      </div>
    );
  }

  if (!submission) return <p className="text-charcoal-400">Submission not found</p>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/submissions")}
          className="rounded-md p-2 text-charcoal-400 hover:bg-charcoal-800 hover:text-cream-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-serif text-2xl text-cream-50">
            Message from {submission.name}
          </h1>
          <p className="text-xs text-charcoal-400">
            {new Date(submission.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => setDeleteOpen(true)}
          className="flex items-center gap-2 rounded-md border border-red-600/30 px-4 py-2 text-sm text-red-400 hover:bg-red-600/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>

      <div className="space-y-6 rounded-lg border border-charcoal-800 bg-charcoal-900 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-[0.15em] text-charcoal-500 uppercase">Name</label>
            <p className="mt-1 text-cream-50">{submission.name}</p>
          </div>
          <div>
            <label className="text-xs tracking-[0.15em] text-charcoal-500 uppercase">Email</label>
            <p className="mt-1">
              <a href={`mailto:${submission.email}`} className="text-oak-400 hover:text-oak-300">
                {submission.email}
              </a>
            </p>
          </div>
        </div>

        {submission.phone && (
          <div>
            <label className="text-xs tracking-[0.15em] text-charcoal-500 uppercase">Phone</label>
            <p className="mt-1 text-cream-50">{submission.phone}</p>
          </div>
        )}

        <div>
          <label className="text-xs tracking-[0.15em] text-charcoal-500 uppercase">Message</label>
          <p className="mt-2 whitespace-pre-wrap text-cream-200 leading-relaxed">
            {submission.message}
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Submission"
        message="Are you sure you want to delete this submission?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
