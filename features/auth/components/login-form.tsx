"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { applyFieldErrors } from "@/shared/forms";
import { showError } from "@/shared/errors/show-error";
import { Button, Input } from "@/shared/ui";
import { loginSchema, type LoginInput } from "../schemas";
import { useAuth } from "../hooks/use-auth";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(input: LoginInput) {
    try {
      await login(input);
    } catch (error) {
      showError(applyFieldErrors(error, setError));
    }
  }

  return (
    <form
      className="grid gap-5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        autoComplete="email"
        error={errors.email?.message}
        label="ایمیل"
        type="email"
        {...register("email")}
      />

      <Input
        autoComplete="current-password"
        error={errors.password?.message}
        label="رمز عبور"
        type="password"
        {...register("password")}
      />

      <Button
        disabled={isLoggingIn}
        type="submit"
      >
        {isLoggingIn ? "در حال ورود..." : "ورود"}
      </Button>
    </form>
  );
}
