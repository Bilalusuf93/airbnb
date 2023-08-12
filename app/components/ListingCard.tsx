'use client';
import { Listing, Reservation } from "@prisma/client";
import { SafeUser } from "../types";
import { useRouter } from "next/navigation";
import useCountries from "../hooks/useCountries";
import React, { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "./HeartButton";
import Button from "./Button";

interface ListingCardProps {
    data: Listing;
    reservation?: Reservation;
    onAction?: (id: string) => void;
    disbaled?: boolean;
    actionLabel?: string
    actionId?: string;
    currentUser?: SafeUser | null;
}
const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    actionLabel,
    actionId = "",
    currentUser,
    disbaled
}) => {
    const router = useRouter();
    const { getByValue } = useCountries();
    const location = getByValue(data.locationValue);

    const handleCancel = useCallback((
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation();

        if (disbaled) {
            return;
        }

        onAction?.(actionId);
    }, [onAction, actionId, disbaled]);

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice
        }

        return data.price
    }, [reservation, data.price]);

    const resercaationDate = useMemo(() => {
        if (!reservation) {
            return null;
        }

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, 'pp')} - ${format(end, 'pp')}`
    }, [reservation])
    return (
        <div
            onClick={() => router.push(`/lisitngs/${data.id}`)}
            className="
        col-span-1 cursor-pointer group
    ">
            <div className="flex flex-col fap-2 w-full">
                <div className="
                aspect-square
                w-fill
                relative
                overflow-hidden
                rounded-xl
            ">
                    <Image
                        fill
                        alt="lisiting"
                        src={data.imageSrc}
                        className="
                        object-cover
                        h-full
                        w-full
                        group-hover:scale-110
                        transition
                    "
                    />
                    <div className="
                        absolute
                        top-3 right-3
                    ">
                        <HeartButton 
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500">
                    {resercaationDate ?? data?.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                       $ {price}
                    </div>
                    {!reservation &&  <div className="font-light">
                        nights
                    </div>}
                </div>
                {onAction && actionLabel && (
                    <Button
                        disabled={disbaled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}
            </div>
        </div>
    )
}

export default ListingCard