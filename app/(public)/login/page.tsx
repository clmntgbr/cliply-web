"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth/context";
import { getLastUsedProvider, setLastUsedProvider, SocialProvider } from "@/lib/cookies";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleLogin, isLoading, token } = useAuth();
  const [lastUsedProvider, setLastUsedProviderState] = useState<SocialProvider | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (token && !isLoading) {
      router.push("/studio");
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    const provider = getLastUsedProvider();
    setLastUsedProviderState(provider);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleLogin({ email, password });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLastUsedProvider("google");
    try {
    } catch {}
  };

  const handleGitHubLogin = async () => {
    setLastUsedProvider("github");
    try {
    } catch {}
  };

  const handleLinkedInLogin = async () => {
    setLastUsedProvider("linkedin");
    try {
    } catch {}
  };

  return (
    <div className="grid h-full min-h-screen lg:grid-cols-2">
      <div className="flex justify-center px-4 py-20">
        <div className="relative flex w-full max-w-[450px] flex-col items-start justify-center">
          <div className="min-h-[450px] w-full">
            <div className="flex flex-col gap-8">
              <div className="grid gap-4">
                <div className="relative">
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    variant="outline"
                    className={`relative flex w-full space-x-2 h-8 hover:bg-muted/70 bg-muted/30 dark:bg-background rounded-md px-4 py-2 ${
                      lastUsedProvider === "google" ? "border border-affirmative-primary " : ""
                    }`}
                  >
                    <span>Continue with Google</span>
                  </Button>
                </div>

                <div className="relative">
                  <Button
                    onClick={handleGitHubLogin}
                    disabled={isLoading}
                    variant="outline"
                    className={`relative flex w-full space-x-2 h-8 hover:bg-muted/70 bg-muted/30 dark:bg-background rounded-md px-4 py-2 ${
                      lastUsedProvider === "github" ? "border border-affirmative-primary " : ""
                    }`}
                  >
                    <span>Continue with GitHub</span>
                  </Button>
                </div>

                <div className="relative">
                  <Button
                    onClick={handleLinkedInLogin}
                    disabled={isLoading}
                    variant="outline"
                    className={`relative flex w-full space-x-2 h-8 rounded-md px-4 py-2 hover:bg-muted/70 bg-muted/30 dark:bg-background ${
                      lastUsedProvider === "linkedin" ? "border border-affirmative-primary " : ""
                    }`}
                  >
                    <span>Continue with LinkedIn</span>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    <Field>
                      <InputGroup>
                        <InputGroupInput
                          id="email"
                          type="email"
                          placeholder="random@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <InputGroupAddon align="block-start">
                          <Label htmlFor="email" className="text-foreground">
                            Email
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild className="hover:bg-transparent">
                              <InputGroupButton variant="ghost" aria-label="Help" className="ml-auto rounded-full" size="icon-xs"></InputGroupButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>We&apos;ll use this to send you notifications</p>
                            </TooltipContent>
                          </Tooltip>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                    <Field>
                      <InputGroup>
                        <InputGroupInput
                          id="password"
                          type="password"
                          placeholder="********"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <InputGroupAddon align="block-start">
                          <Label htmlFor="password" className="text-foreground">
                            Password
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild className="hover:bg-transparent">
                              <InputGroupButton variant="ghost" aria-label="Help" className="ml-auto rounded-full" size="icon-xs"></InputGroupButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Password must be at least 8 characters</p>
                            </TooltipContent>
                          </Tooltip>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                    <div className="flex flex-col gap-3">
                      <div className="relative flex items-center">
                        <div className="grow">
                          <Button type="submit" disabled={isLoading} className="w-full h-8 rounded-md px-4 py-2">
                            Continue
                          </Button>
                        </div>
                      </div>

                      <div className="text-center text-base font-normal">
                        <span className="text-sm text-muted-foreground">
                          Don&apos;t have an account?{" "}
                          <Link href="/register" className="text-sm text-primary underline">
                            Create your account
                          </Link>
                        </span>
                      </div>
                      <FieldDescription className="px-6 text-center pt-5">
                        By clicking login, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                      </FieldDescription>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 hidden h-screen rounded-xl p-4 lg:block">
        <div className="h-full w-full rounded-xl bg-linear-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary/30 dark:via-primary/20 dark:to-accent/30">
          <Image
            alt="LoginBanner"
            loading="eager"
            width="1384"
            height="1824"
            decoding="async"
            data-nimg="1"
            className="pointer-events-none block h-full w-full select-none rounded-xl object-cover dark:hidden"
            style={{ color: "transparent" }}
            src="/background.webp"
          />
        </div>
      </div>
    </div>
  );
}
