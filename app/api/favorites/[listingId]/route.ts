import  { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { strict } from 'assert';

interface IParams {
    listingId?: string;
}

export async function POST(
    request: Request,
    { params }: {params: IParams}
) {
    const  currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid Id')
    }

    const favouritIds = [...(currentUser.favouritIds) ?? []];
    favouritIds.push(listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favouritIds
        }
    });
    return NextResponse.json(user);
};

export async function DELETE(request: Request, { params }: {params: IParams}) {
    const  currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid Id')
    }

    let favouritIds = [...(currentUser.favouritIds) ?? []];
    favouritIds = favouritIds.filter((id) => id !== listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favouritIds
        }
    });
    return NextResponse.json(user);
}