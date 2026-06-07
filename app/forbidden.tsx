export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <section className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm font-semibold tracking-widest text-red-300">
          403
        </p>
        <h1 className="mt-3 text-3xl font-black">دسترسی مجاز نیست</h1>
        <p className="mt-4 leading-7 text-slate-300">
          حساب شما اجازه مشاهده این بخش را ندارد.
        </p>
      </section>
    </main>
  );
}
