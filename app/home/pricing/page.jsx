"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadScript } from "@/utils/razorPayHelper";
import { successToast } from "@/utils/toaster";
import { ToastContainer } from "react-toastify";

export default function PricingPage() {
  const paymentHandler = async () => {
    await loadScript();

    const user = await fetch("/api/users", { method: "GET" });
    const temp = await user.json();

    const name =
      temp.success.user.userFirstName + " " + temp.success.user.userLastName;
    const email = temp.success.user.userEmail;

    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({
        productName: "extraApiCalls",
        currency: "INR",
        notes: {},
      }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "My Store",
      description: "Test Payment",
      order_id: order.id,

      handler: async function (response) {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(response),
        });

        const data = await verifyRes.json();

        if (data.success) {
          const creditsRes = await fetch("/api/credits", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ increment: "incrBsc" }),
          });
          const creds = await creditsRes.json();
          if (creds.success) {
            successToast("Payment successful. You received 5 more AI calls");
          }
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error("Payment verification failed");
        }
      },

      prefill: {
        name,
        email,
      },

      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="flex justify-center items-center py-10">
      <ToastContainer />
      <Card className="w-[320px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">₹10</CardTitle>
          <CardDescription>
            get 5 more ai generated calls for estimate
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground">
          One-time purchase
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={() => paymentHandler()}>
            Buy Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
