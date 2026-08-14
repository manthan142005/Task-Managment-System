import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // Creates a brand-new guest user every time "Continue as Guest" is pressed.
  async guestLogin() {
    const guestNumber = Math.floor(Math.random() * 100000);
    const user = await this.prisma.user.create({
      data: {
        email: `guest-${guestNumber}-${Date.now()}@pyramid.local`,
        fullName: `Guest ${guestNumber}`,
        username: `guest${guestNumber}`,
        authProvider: 'GUEST',
      },
    });
    return this.signToken(user.id, user.email);
  }

  // Minimal Google login stub: in production, verify the Google ID token
  // server-side (e.g. with google-auth-library) before trusting the email.
  async googleLogin(email: string, fullName: string, avatarUrl?: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { email, fullName, avatarUrl, authProvider: 'GOOGLE' },
      });
    }
    return this.signToken(user.id, user.email);
  }

  private signToken(sub: string, email: string) {
    const token = this.jwt.sign({ sub, email });
    return { access_token: token };
  }
}
