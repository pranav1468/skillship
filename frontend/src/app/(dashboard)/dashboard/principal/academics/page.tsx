"use client";

import { useState } from "react";

// T-044: Academics management — AcademicYear, Class, Course, Enrollment
// Wired to Prashant's Sprint 2 APIs: /api/v1/academics/years/, /classes/, /courses/, /enrollments/

type Tab = "years" | "classes" | "courses" | "enrollment";

const TABS: { id: Tab; label: string }[] = [
  { id: "years", label: "Academic Years" },
  { id: "classes", label: "Classes" },
  { id: "courses", label: "Courses" },
  { id: "enrollment", label: "Enrollment" },
];

// ─── Academic Year ────────────────────────────────────────────────────────────
function YearsTab() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">Manage academic years for your school.</p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {showForm ? "Cancel" : "+ New Year"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Add Academic Year</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Name</label>
              <input required placeholder="e.g. 2025–26" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Start Date</label>
              <input required type="date" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">End Date</label>
              <input required type="date" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
          </div>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Save Year
          </button>
        </form>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Start</th>
              <th className="px-5 py-3">End</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-5 py-8 text-center text-[var(--muted-foreground)] text-sm">
                No academic years yet — API connects in Sprint 2.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Classes ─────────────────────────────────────────────────────────────────
function ClassesTab() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">Create and manage classrooms. Each class belongs to an academic year.</p>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          {showForm ? "Cancel" : "+ New Class"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }} className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Add Class</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Section Name</label>
              <input required placeholder="e.g. Class 9A" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Academic Year</label>
              <select required className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="">Select year…</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Class Teacher</label>
              <select className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="">Assign later…</option>
              </select>
            </div>
          </div>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">Save Class</button>
        </form>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              <th className="px-5 py-3">Section</th>
              <th className="px-5 py-3">Year</th>
              <th className="px-5 py-3">Teacher</th>
              <th className="px-5 py-3">Students</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-5 py-8 text-center text-[var(--muted-foreground)] text-sm">No classes yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Courses ─────────────────────────────────────────────────────────────────
function CoursesTab() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">Define subjects and courses offered each academic year.</p>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          {showForm ? "Cancel" : "+ New Course"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }} className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Add Course</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Course Name</label>
              <input required placeholder="e.g. Science Grade 9" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Subject</label>
              <input required placeholder="e.g. Science" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Academic Year</label>
              <select required className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="">Select year…</option>
              </select>
            </div>
          </div>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">Save Course</button>
        </form>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="px-5 py-8 text-center text-[var(--muted-foreground)] text-sm">No courses yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Enrollment ───────────────────────────────────────────────────────────────
function EnrollmentTab() {
  const [mode, setMode] = useState<"list" | "bulk">("list");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-[var(--muted-foreground)]">Enroll students into classes. Supports bulk CSV import.</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setMode("list")} className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${mode === "list" ? "bg-primary text-white" : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"}`}>
            Manual
          </button>
          <button type="button" onClick={() => setMode("bulk")} className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${mode === "bulk" ? "bg-primary text-white" : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"}`}>
            Bulk CSV
          </button>
        </div>
      </div>

      {mode === "bulk" ? (
        <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)]/20 p-10 text-center">
          <div className="text-3xl mb-2">📄</div>
          <p className="text-sm font-medium text-[var(--foreground)]">Drop CSV file here or click to upload</p>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-1">Format: student_id, class_id — one row per enrollment</p>
          <input type="file" accept=".csv" className="mt-4 block mx-auto text-sm text-[var(--muted-foreground)]" />
          <button type="button" className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white hover:opacity-90">
            Upload &amp; Enroll
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Student</label>
              <select required className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="">Select student…</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Class</label>
              <select required className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="">Select class…</option>
              </select>
            </div>
          </div>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">Enroll</button>
        </form>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Class</th>
              <th className="px-5 py-3">Enrolled On</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-5 py-8 text-center text-[var(--muted-foreground)] text-sm">No enrollments yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("years");

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Academics Management</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Manage academic structure — years, classes, courses, and student enrollment.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === t.id
                ? "bg-white shadow-sm text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "years" && <YearsTab />}
      {activeTab === "classes" && <ClassesTab />}
      {activeTab === "courses" && <CoursesTab />}
      {activeTab === "enrollment" && <EnrollmentTab />}
    </div>
  );
}
