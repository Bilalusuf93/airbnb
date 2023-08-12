"use client";
import { signIn } from 'next-auth/react';
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState, useCallback } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { toast } from "react-hot-toast";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/input";
import Button from "../Button";
import { useRouter } from 'next/navigation'
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';

const LoginModal = () => {
  const loginModal = useLoginModal();
  const router = useRouter()
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn('credentials', {
      ...data,
      redirect: false,
    })
    .then((calbback) => {
      setIsLoading(false)

      if (calbback?.ok) {
        toast.success('Logged In')
        router.refresh();

        loginModal.onClose()
      }
      if (calbback?.error) {
        toast.error(calbback.error);
      }
    })
  };

  const toggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subTitle="Login to your account" />
      <Input
        id="email"
        label="Email"
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
        onClick={() => signIn('github')}
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
          <div>First time using Airbnb?</div>
          <div
            onClick={toggle}
            className="
                        text-neutera-800
                        cursor-pointer
                        hover:underline
                    "
          >
            Create an account
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
