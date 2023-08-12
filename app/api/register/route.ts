import bcrypt from "bcrypt";
import prisma from '@/app/libs/prismadb'
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  // try {
    const body = await request.json();
    const { email, password, name } = body;
    const hashedPassword = await bcrypt.hash(password, 12);


    const user = await prisma?.user?.create({
      data: {
        email,
        name,
        hashedPassword
      }
    })
    console.log('user register=>', body);
    return NextResponse.json(body);
  // } catch (error) {
  //   return NextResponse.json({ Error: error });
  // }

}
