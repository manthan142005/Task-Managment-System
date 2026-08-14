import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  me(@Req() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  updateMe(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @Patch('me/theme')
  updateTheme(@Req() req: any, @Body() body: { themeMode?: string; colorMode?: string }) {
    return this.usersService.updateTheme(req.user.userId, body.themeMode, body.colorMode);
  }

  @Get()
  listAll() {
    return this.usersService.listAll();
  }
}
