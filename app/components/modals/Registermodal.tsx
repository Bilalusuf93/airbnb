"use client";
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState, useCallback } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useRegiterModal from "@/app/hooks/useRegisterModal";
import { toast } from "react-hot-toast";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/input";
import Button from "../Button";
const Registermodal = () => {
  const registermodal = useRegiterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post(`/api/register`, data)
      .then(() => {
        registermodal.onClose();
      })
      .catch((error) => {
        toast.error("Something went wront!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Airbnb" subTitle="Create ana account" />
      <Input
        id="email"
        label="Email"
        required={true}
        register={register}
        errors={errors}
      />
      <Input
        id="name"
        label="Name"
        required={true}
        register={register}
        errors={errors}
      />
      <Input
        type="password"
        id="password"
        label="Password"
        required={true}
        register={register}
        errors={errors}
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        Icon={FcGoogle}
        onClick={() => {}}
      />
      <Button
        outline
        label="Continue with Github"
        Icon={AiFillGithub}
        onClick={() => {}}
      />
      <div
        className="text-neutral-500
             text-center
              mt-4
               font-light
               "
      >
        <div
          className="
                flex
                flex-row
                justify-center
                items-center
                gap-3
            "
        >
          <div>Already have an account?</div>
          <div
            onClick={registermodal.onClose}
            className="
                        text-neutera-800
                        cursor-pointer
                        hover:underline
                    "
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      isOpen={registermodal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registermodal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default Registermodal;
