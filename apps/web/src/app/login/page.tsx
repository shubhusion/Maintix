'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Quote,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlurFade } from '@/components/ui/blur-fade';
import { DotPattern } from '@/components/ui/dot-pattern';
import { ShineBorder } from '@/components/ui/shine-border';
import { ThemeToggle } from '@/components/theme-toggle';
import { ApiError } from '@/lib/api-client';

const BRAND_FEATURES = [
  'Unlimited properties & users',
  'Role-based access for every team',
  '6-stage validated ticket workflow',
  'Real-time notifications & updates',
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ── Left Brand Panel (desktop only) ── */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden">
        {/* Background layers */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-white dark:from-[#09090b] dark:via-[#09090b] dark:to-[#09090b]"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary-400/10 dark:bg-primary-600/15 blur-[150px] animate-glow-pulse will-change-transform" />
          <div className="absolute bottom-1/4 right-0 h-[400px] w-[400px] rounded-full bg-primary-300/10 dark:bg-primary-500/10 blur-[120px] animate-glow-pulse [animation-delay:2s] will-change-transform" />

          <DotPattern
            width={32}
            height={32}
            cr={1}
            className="absolute inset-0 opacity-[0.15] dark:opacity-[0.12] text-primary-500/50 [mask-image:radial-gradient(500px_circle_at_50%_45%,white,transparent)]"
          />

          <div className="noise absolute inset-0 opacity-30 dark:opacity-100" />
        </div>

        {/* Panel content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-16">
          <BlurFade delay={0} direction="right">
            <Link href="/" className="mb-10 inline-flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm font-bold shadow-lg shadow-primary-600/20 transition-transform duration-300 group-hover:scale-110">
                M
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground dark:text-white">
                Maintix
              </span>
            </Link>
          </BlurFade>

          <BlurFade delay={0.1} direction="right">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-[-0.03em] text-foreground dark:text-white leading-tight font-display max-w-md">
              Manage every property,
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 dark:from-primary-300 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                from one place.
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2} direction="right">
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Streamline maintenance workflows with role-based access for managers, technicians, and
              tenants.
            </p>
          </BlurFade>

          <BlurFade delay={0.3} direction="right">
            <ul className="mt-8 space-y-3">
              {BRAND_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-foreground/80 dark:text-neutral-300"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-500 dark:text-accent-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </BlurFade>

          {/* Testimonial (#23) */}
          <BlurFade delay={0.35} direction="right">
            <div className="mt-10 rounded-xl border border-border/30 bg-card/40 dark:border-white/[0.06] dark:bg-white/[0.03] backdrop-blur-md p-5 max-w-sm">
              <Quote className="h-5 w-5 text-primary-400/60 mb-2" />
              <p className="text-sm text-foreground/80 dark:text-neutral-300 leading-relaxed italic">
                &ldquo;Maintix saved us 10 hours per week on maintenance coordination. The ticket
                workflow is a game-changer.&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/10 text-xs font-bold text-primary-600 dark:text-primary-400">
                  JM
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground dark:text-white">
                    James Mitchell
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Property Manager, Sunrise Apartments
                  </p>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 px-12 xl:px-16 pb-8">
          <BlurFade delay={0.4} direction="up">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Maintix. All rights reserved.
            </p>
          </BlurFade>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="relative flex flex-col bg-background">
        {/* Mobile gradient wash */}
        <div
          className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/20 dark:to-transparent lg:hidden"
          aria-hidden="true"
        />

        {/* Top bar: back link + theme toggle */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-6">
          <BlurFade delay={0}>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-1 py-0.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </BlurFade>
          <BlurFade delay={0}>
            <ThemeToggle />
          </BlurFade>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-[420px]">
            <BlurFade delay={0.05}>
              <Card className="relative rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl shadow-xl overflow-hidden">
                <ShineBorder shineColor={['#6366f1', '#34d399']} borderWidth={1} duration={12} />

                <CardHeader className="text-center pb-2">
                  <BlurFade delay={0.1}>
                    <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-lg font-bold shadow-lg shadow-primary-600/20">
                      M
                    </div>
                  </BlurFade>
                  <BlurFade delay={0.15}>
                    <CardTitle className="text-2xl font-extrabold tracking-tight font-display">
                      Welcome to{' '}
                      <span className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
                        Maintix
                      </span>
                    </CardTitle>
                  </BlurFade>
                  <BlurFade delay={0.2}>
                    <CardDescription>Sign in to your maintenance platform</CardDescription>
                  </BlurFade>
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    aria-label="Sign in to Maintix"
                  >
                    {/* Error banner */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 rounded-lg bg-error-50 p-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400"
                        >
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email field */}
                    <BlurFade delay={0.2}>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-error-500">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 focus-visible:ring-primary-500/50 focus-visible:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                            {...register('email')}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                          />
                        </div>
                        {errors.email && (
                          <p id="email-error" className="text-sm text-error-500" role="alert">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </BlurFade>

                    {/* Password field */}
                    <BlurFade delay={0.25}>
                      <div className="space-y-2">
                        <Label htmlFor="password">
                          Password <span className="text-error-500">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 focus-visible:ring-primary-500/50 focus-visible:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                            {...register('password')}
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? 'password-error' : 'password-help'}
                          />
                        </div>
                        {errors.password && (
                          <p id="password-error" className="text-sm text-error-500" role="alert">
                            {errors.password.message}
                          </p>
                        )}
                        {!errors.password && (
                          <p id="password-help" className="text-xs text-muted-foreground">
                            Must be at least 8 characters with an uppercase letter and a number.
                          </p>
                        )}
                      </div>
                    </BlurFade>

                    {/* Submit */}
                    <BlurFade delay={0.3}>
                      <div className="pt-1">
                        <Button
                          type="submit"
                          className="w-full rounded-xl h-11 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-white dark:to-neutral-100 dark:text-neutral-900 text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:-translate-y-0.5"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Signing in…
                            </>
                          ) : (
                            <>
                              Sign In
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Keyboard hint (#24) */}
                      <p className="text-center text-xs text-muted-foreground mt-3">
                        Press{' '}
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                          Enter
                        </kbd>{' '}
                        to sign in
                      </p>
                    </BlurFade>
                  </form>
                </CardContent>
              </Card>
            </BlurFade>

            {/* Trust indicators (#12) */}
            <BlurFade delay={0.35}>
              <div className="mt-5 flex items-center justify-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Secure login
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  256-bit SSL
                </span>
              </div>
            </BlurFade>

            {/* Footer links (#16) */}
            <BlurFade delay={0.35}>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                  <span aria-hidden="true">&middot;</span>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground lg:hidden">
                  &copy; {new Date().getFullYear()} Maintix. All rights reserved.
                </p>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  );
}
