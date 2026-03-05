"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast } from "@/utils/toaster";
import { isValidEmail, isValidName, isValidPassword } from "@/utils/validators";

export function SignupForm({ className, ...props }) {
  const init = {
    userFirstName: "",
    userLastName: "",
    userPassword: "",
    userEmail: "",
  };
  const [userInfo, setuserInfo] = useState(init);
  const [confirmPwd, setConfirmPwd] = useState("");
  const changeInfoHandler = (objectKey, value) => {
    setuserInfo((prev) => ({
      ...prev,
      [objectKey]: value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (confirmPwd !== userInfo.userPassword) {
      errorToast("Please fill both password fields accurately");
      return;
    }
    if (!isValidEmail(userInfo.userEmail)) {
      errorToast("Provide an accurate email");
      return;
    }
    if (
      !isValidName(userInfo.userFirstName) ||
      !isValidName(userInfo.userLastName)
    ) {
      errorToast("Provide an accurate name");
      return;
    }
    if (!isValidPassword(userInfo.userPassword)) {
      errorToast(
        "Make sure password has one upperCase, one lowerCase, one digit and one symbol",
      );
      return;
    }
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userInfo, requestType: "signup" }),
    });
    const opt = await res.json();
    if (opt.success) {
      successToast(opt.success.message, 2000);
      successToast(
        `you can now login by your email as well as your unique id - ${opt.success.newUId} sent to your email`,
        20000,
      );
    }
    if (opt.error) {
      errorToast(opt.error, 2500);
    }
    setuserInfo(init);
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <div className="flex justify-between">
            <Input
              id="name"
              type="text"
              placeholder="First name"
              required
              style={{ width: "49%" }}
              onChange={(e) => {
                changeInfoHandler("userFirstName", e.target.value);
              }}
            />
            <Input
              id="name"
              type="text"
              placeholder="Last name"
              required
              style={{ width: "49%" }}
              onChange={(e) => {
                changeInfoHandler("userLastName", e.target.value);
              }}
            />
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => {
              changeInfoHandler("userEmail", e.target.value);
            }}
          />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            onChange={(e) => {
              changeInfoHandler("userPassword", e.target.value);
            }}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            onChange={(e) => {
              setConfirmPwd(e.target.value);
            }}
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/user/login/">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
