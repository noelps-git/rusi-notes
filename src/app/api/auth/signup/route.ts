import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import type { SignUpData } from '@/types/auth';

export async function POST(req: NextRequest) {
  try {
    const body: SignUpData = await req.json();
    const { email, password, fullName, role, businessData } = body;

    // Validate required fields
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['user', 'business', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const supabase = await createClient();

    // Prepare user data
    const userData: any = {
      email,
      password_hash: passwordHash,
      full_name: fullName,
      role,
    };

    // Add business-specific fields if role is business
    if (role === 'business' && businessData) {
      userData.business_name = businessData.businessName;
      userData.business_license = businessData.businessLicense;
      userData.business_verified = false; // Requires admin approval
    }

    // Insert user
    const { data: user, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique violation
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
      console.error('Database error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
