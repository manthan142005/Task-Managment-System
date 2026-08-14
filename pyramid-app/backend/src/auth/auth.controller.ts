import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('guest')
  async guest(@Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.guestLogin();
    this.setCookie(res, access_token);
    return { access_token };
  }

  @Post('google')
  async google(
    @Body() body: { email: string; fullName: string; avatarUrl?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.googleLogin(
      body.email,
      body.fullName,
      body.avatarUrl,
    );
    this.setCookie(res, access_token);
    return { access_token };
  }

  private setCookie(res: Response, token: string) {
    res.cookie('pyramid_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
}
