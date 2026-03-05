"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { errorToast, successToast } from "@/utils/toaster";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

const ProfilePage = () => {
  const init = {
    userId: "",
    userFirstName: "",
    userLastName: "",
    userPassword: "",
    userEmail: "",
  };
  let addressInit = {
    home: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  };
  const [userInfo, setuserInfo] = useState(init);
  const [userAddressInfo, setUserAddressInfo] = useState(addressInit);
  const [defaultUser, setDefaultUser] = useState(init);
  const [defaultAddress, setDefaultAddress] = useState(addressInit);
  const [isProfileEditable, setIsProfileEditable] = useState(false);
  const [isAddressEditable, setIsAddressEditable] = useState(false);
  const changeInfoHandler = (objectKey, value, setter) => {
    setter((prev) => ({
      ...prev,
      [objectKey]: value,
    }));
  };
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/users", { method: "GET" });
      const temp = await res.json();
      if (temp.error) {
        router.push("/");
      }
      for (const [key, val] of Object.entries(temp.success.user)) {
        if (key == "_id" || key == "__v") {
          continue;
        }
        if (key == "userAddress") {
          setDefaultAddress(val);
          for (const [subkey, value] of Object.entries(val)) {
            changeInfoHandler(subkey, value, setUserAddressInfo);
          }
          continue;
        }
        changeInfoHandler(key, val, setuserInfo);
        changeInfoHandler(key, val, setDefaultUser);
      }
    }
    fetchData();
  }, []);
  const bodyGenerator = (userData, defaultData, body) => {
    for (const [key, value] of Object.entries(userData)) {
      if (defaultData[key] != value) {
        body[key] = value;
      }
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    let reqBody = {};
    bodyGenerator(userInfo, defaultUser, reqBody);
    let changedAddress = {};
    bodyGenerator(userAddressInfo, defaultAddress, changedAddress);
    if (Object.keys(changedAddress).length > 0) {
      reqBody.userAddress = {
        ...defaultAddress,
        ...changedAddress,
      };
    }
    if (Object.keys(reqBody).length === 0) {
      errorToast("No changes detected");
      return;
    }

    const res = await fetch("/api/users", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    const temp = await res.json();
    if (temp.success) {
      successToast(temp.success.message);
      setDefaultUser(userInfo);
      setDefaultAddress(userAddressInfo);
    } else {
      errorToast(temp.error);
    }
  };
  return (
    <div className="m-4">
      <ToastContainer />
      <div className="bg-neutral-100  rounded-xl  flex flex-col p-4 my-4">
        <div className="flex flex-row justify-between mb-4">
          <h1>Personal Details</h1>
          <Button
            onClick={() => {
              setIsProfileEditable(true);
              setIsAddressEditable(false);
            }}
          >
            Edit
          </Button>
        </div>
        <div>
          <form onSubmit={submitHandler}>
            <div className="flex flex-row mb-4 justify-between">
              <Field style={{ width: "45%" }}>
                <FieldLabel htmlFor="fieldgroup-userid">User Id:</FieldLabel>
                <Input
                  id="fieldgroup-userid"
                  type="text"
                  placeholder="abcd123456"
                  disabled={true}
                  value={userInfo.userId}
                />
              </Field>
              <Field style={{ width: "45%" }}>
                <FieldLabel htmlFor="fieldgroup-password">Password:</FieldLabel>
                <Input
                  id="fieldgroup-password"
                  type={isProfileEditable ? "text" : "password"}
                  placeholder={
                    isProfileEditable
                      ? "type new password"
                      : "******************************"
                  }
                  disabled={!isProfileEditable}
                  value={userInfo.userPassword}
                  onChange={(e) => {
                    changeInfoHandler(
                      "userPassword",
                      e.target.value,
                      setuserInfo,
                    );
                  }}
                />
              </Field>
            </div>
            <div className="flex flex-row mb-4 justify-between">
              <Field style={{ width: "45%" }}>
                <FieldLabel htmlFor="fieldgroup-first-name">
                  First Name:
                </FieldLabel>
                <Input
                  id="fieldgroup-first-name"
                  type="text"
                  placeholder="John"
                  disabled={!isProfileEditable}
                  value={userInfo.userFirstName}
                  onChange={(e) => {
                    changeInfoHandler(
                      "userFirstName",
                      e.target.value,
                      setuserInfo,
                    );
                  }}
                />
              </Field>
              <Field style={{ width: "45%" }}>
                <FieldLabel htmlFor="fieldgroup-last-name">
                  Last Name:
                </FieldLabel>
                <Input
                  id="fieldgroup-last-name"
                  type="text"
                  placeholder="Doe"
                  disabled={!isProfileEditable}
                  value={userInfo.userLastName}
                  onChange={(e) => {
                    changeInfoHandler(
                      "userLastName",
                      e.target.value,
                      setuserInfo,
                    );
                  }}
                />
              </Field>
            </div>
            <div className="flex flex-row mb-4 justify-between">
              <Field>
                <FieldLabel htmlFor="fieldgroup-email">Email:</FieldLabel>
                <Input
                  id="fieldgroup-email"
                  type="email"
                  placeholder="abc@xyz.com"
                  disabled={true}
                  value={userInfo.userEmail}
                />
              </Field>
            </div>
            {isProfileEditable && (
              <div className="flex flex-row">
                <Button
                  type="submit"
                  className={
                    "bg-green-300 text-gray-700 cursor-pointer hover:bg-green-400 w-1/6"
                  }
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setuserInfo(defaultUser);
                    setIsProfileEditable(false);
                  }}
                  className={
                    "bg-red-300 w-1/6 text-gray-700 cursor-pointer hover:bg-red-400"
                  }
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="bg-neutral-100  rounded-xl flex flex-col p-4 my-4">
        <div className="flex flex-row justify-between mb-4">
          <h1>Address</h1>
          <Button
            onClick={() => {
              setIsAddressEditable(true);
              setIsProfileEditable(false);
            }}
          >
            Edit
          </Button>
        </div>
        <div>
          <form
            onSubmit={submitHandler}
            className="flex flex-col justify-between"
          >
            <div className="flex flex-row mb-4 justify-between">
              <Field style={{ width: "45%" }}>
                <FieldLabel htmlFor="fieldgroup-home-address">
                  Home Address:
                </FieldLabel>
                <Input
                  id="fieldgroup-home-address"
                  type="text"
                  placeholder="123 Main St, Apt 4B"
                  disabled={!isAddressEditable}
                  required={true}
                  value={userAddressInfo.home}
                  onChange={(e) => {
                    changeInfoHandler(
                      "home",
                      e.target.value,
                      setUserAddressInfo,
                    );
                  }}
                />
              </Field>
              <Field style={{ width: "45%" }}>
                <FieldLabel htmlFor="fieldgroup-city">City:</FieldLabel>
                <Input
                  id="fieldgroup-city"
                  type="text"
                  placeholder="San Francisco"
                  disabled={!isAddressEditable}
                  value={userAddressInfo.city}
                  required={true}
                  onChange={(e) => {
                    changeInfoHandler(
                      "city",
                      e.target.value,
                      setUserAddressInfo,
                    );
                  }}
                />
              </Field>
            </div>
            <div className="flex flex-row justify-between mb-4">
              <Field style={{ width: "30%" }}>
                <FieldLabel htmlFor="fieldgroup-state">State:</FieldLabel>
                <Input
                  id="fieldgroup-state"
                  type="text"
                  placeholder="California"
                  disabled={!isAddressEditable}
                  required={true}
                  value={userAddressInfo.state}
                  onChange={(e) => {
                    changeInfoHandler(
                      "state",
                      e.target.value,
                      setUserAddressInfo,
                    );
                  }}
                />
              </Field>
              <Field style={{ width: "30%" }}>
                <FieldLabel htmlFor="fieldgroup-country">Country:</FieldLabel>
                <Input
                  id="fieldgroup-country"
                  type="text"
                  placeholder="United States"
                  disabled={!isAddressEditable}
                  value={userAddressInfo.country}
                  required={true}
                  onChange={(e) => {
                    changeInfoHandler(
                      "country",
                      e.target.value,
                      setUserAddressInfo,
                    );
                  }}
                />
              </Field>
              <Field style={{ width: "30%" }}>
                <FieldLabel htmlFor="fieldgroup-postal-address">
                  Postal code:
                </FieldLabel>
                <Input
                  id="fieldgroup-postal-address"
                  type="text"
                  placeholder="94XXXX"
                  disabled={!isAddressEditable}
                  value={userAddressInfo.postalCode}
                  onChange={(e) => {
                    changeInfoHandler(
                      "postalCode",
                      e.target.value,
                      setUserAddressInfo,
                    );
                  }}
                />
              </Field>
            </div>
            {isAddressEditable && (
              <div className="flex flex-row">
                <Button
                  type="submit"
                  className={
                    "bg-green-300 text-gray-700 cursor-pointer hover:bg-green-400 w-1/6"
                  }
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setUserAddressInfo(defaultAddress);
                    setIsAddressEditable(false);
                  }}
                  className={
                    "bg-red-300 w-1/6 text-gray-700 cursor-pointer hover:bg-red-400"
                  }
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
