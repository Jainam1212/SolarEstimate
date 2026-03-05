"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { errorToast, successToast } from "@/utils/toaster";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export function LoginForm({ className, ...props }) {
  const initialState = {
    userEmail: "",
    userPassword: "",
  };
  const [userInfo, setUserInfo] = useState(initialState);
  const router = useRouter();
  const changeInfoHandler = (type, value) => {
    switch (type) {
      case "email":
        setUserInfo((prev) => ({
          ...prev,
          userEmail: value,
        }));
        break;
      case "pwd":
        setUserInfo((prev) => ({
          ...prev,
          userPassword: value,
        }));
        break;
      default:
        break;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const resp = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userInfo, requestType: "login" }),
    });
    const opt = await resp.json();

    if (!resp.ok || opt.error) {
      errorToast(opt.error || "Something went wrong");
      return;
    }
    successToast(opt.success.message);
    setTimeout(() => {
      router.push("/home");
    }, 500);
    return;
  };

  return (
    <form
      onSubmit={submitHandler}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <ToastContainer />
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => {
              changeInfoHandler("email", e.target.value);
            }}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/app/user/recovery"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            onChange={(e) => {
              changeInfoHandler("pwd", e.target.value);
            }}
          />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/user/register/"
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
