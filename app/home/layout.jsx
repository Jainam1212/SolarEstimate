"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";

export default function NavigationMenuDemo({ children }) {
  const [userName, setUserName] = React.useState("");
  const router = useRouter();
  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/users", { method: "GET" });
      const temp = await res.json();
      if (temp.error) {
        router.push("/");
      }
      setUserName(temp.success.user.userFirstName);
    }
    fetchData();
  }, []);
  const logoutHandler = async (e) => {
    await fetch("/api/users", { method: "DELETE" });
    router.push("/");
  };
  return (
    <div className="w-screen h-screen">
      <NavigationMenu
        className={
          "bg-gray-100 p-4 m-4 rounded-xl justify-between sticky top-4"
        }
      >
        <div>
          <NavigationMenuList className={"w-full"}>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={" hover:bg-gray-300"}>
                Home
              </NavigationMenuTrigger>
              <NavigationMenuContent className={"relative bg-white z-10"}>
                <ul className="w-96">
                  <ListItem href="/home" title="Hope Page">
                    Calculate Estimate
                  </ListItem>
                  <ListItem href="/home/guide" title="Introduction">
                    How to use
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle() + " hover:bg-gray-300"}
              >
                <Link href="/home/profile">Profile</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle() + " hover:bg-gray-300"}
              >
                <Link href="#" onClick={logoutHandler}>
                  Logout
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
        <div>
          <p className="text-2xl">
            Welcome <b>{userName}</b>
          </p>
        </div>
      </NavigationMenu>
      {children}
    </div>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
