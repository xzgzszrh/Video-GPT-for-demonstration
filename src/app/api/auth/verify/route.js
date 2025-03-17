import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    // Check if the password matches the environment variable
    if (password === process.env.PASSWORD) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: '密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json(
      { success: false, message: '验证过程中出现错误' },
      { status: 500 }
    );
  }
}
