export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="mx-auto max-w-4xl p-8">
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">About E-Learning</h1>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">
            E-Learning is a simple demo platform for building courses, managing students, and supporting
            teachers with tools for content, assessments, and insights.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Mission</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Make learning accessible and measurable — provide clear progress, meaningful feedback,
              and tools for teachers to create engaging lessons.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Who it’s for</h3>
            <ul className="mt-2 space-y-2 text-slate-700 dark:text-slate-300 list-disc pl-5">
              <li>Students: self-paced lessons, quizzes, and progress tracking.</li>
              <li>Teachers: course creation, grading, and live session support.</li>
              <li>Admins: user management, analytics, and platform settings.</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Features</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <strong className="block text-slate-900 dark:text-slate-50">Course Builder</strong>
              <p className="text-sm text-slate-700 dark:text-slate-300">Create lessons, modules, and quizzes.</p>
            </div>
            <div>
              <strong className="block text-slate-900 dark:text-slate-50">Progress Tracking</strong>
              <p className="text-sm text-slate-700 dark:text-slate-300">Track student completion and scores.</p>
            </div>
            <div>
              <strong className="block text-slate-900 dark:text-slate-50">Roles & Permissions</strong>
              <p className="text-sm text-slate-700 dark:text-slate-300">Flexible access for students, teachers, and admins.</p>
            </div>
          </div>
        </section>

        <section className="mt-8 text-sm text-slate-600 dark:text-slate-400">
          <p>
            This is a demo app intended to illustrate a simple e-learning layout and flows. If you'd like
            features such as SSO, persistent backend storage, or analytics, I can add examples and integration
            steps.
          </p>
        </section>
      </main>
    </div>
  );
}
