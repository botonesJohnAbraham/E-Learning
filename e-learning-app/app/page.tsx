import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-lg font-semibold tracking-tight">E-Learning</div>
          <nav className="flex items-center gap-4 text-sm text-slate-200">
            <Link href="#home" className="transition hover:text-white">
              Home
            </Link>
            <Link href="#about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/student" className="transition hover:text-white">
              Student
            </Link>
            <Link href="/teacher" className="transition hover:text-white">
              Teacher
            </Link>
            <Link href="/admin" className="transition hover:text-white">
              Admin
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-24 pt-16 sm:px-8">
        <section id="home" className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full bg-cyan-500/15 px-4 py-1 text-sm font-medium text-cyan-200">
              Modern e-learning platform
            </div>
            <div>
              <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                Learn anytime, anywhere.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Build powerful online courses with student progress, teacher tools, and admin analytics — all in one clean learning experience.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Get Started
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-base text-slate-100 transition hover:border-white/30 hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Course Spotlight</p>
                <h2 className="mt-4 text-2xl font-semibold">Design Thinking for Digital Skills</h2>
                <p className="mt-3 text-slate-300">
                  A flexible learning path for students, with teacher-led sessions and progress tracking built in.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/75 p-5">
                  <p className="text-sm font-medium text-slate-300">Students</p>
                  <p className="mt-3 text-lg font-semibold text-white">Self-paced lessons</p>
                </div>
                <div className="rounded-3xl bg-slate-950/75 p-5">
                  <p className="text-sm font-medium text-slate-300">Teachers</p>
                  <p className="mt-3 text-lg font-semibold text-white">Live class tools</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-semibold">E-Learning designed for every role</h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                Empower students with course progress and exams, give teachers better planning and feedback tools, and let admins manage settings, analytics, and access from one central dashboard.
              </p>
            </div>
            <div className="space-y-4 rounded-3xl bg-slate-950/80 p-8">
              <div>
                <p className="text-sm text-cyan-300">Teacher</p>
                <p className="mt-2 text-lg text-slate-100">Create courses, grade assignments, and support learners.</p>
              </div>
              <div>
                <p className="text-sm text-cyan-300">Student</p>
                <p className="mt-2 text-lg text-slate-100">Access lessons on-demand and track skill growth over time.</p>
              </div>
              <div>
                <p className="text-sm text-cyan-300">Admin</p>
                <p className="mt-2 text-lg text-slate-100">Manage platform settings, user roles, and engagement analytics.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
