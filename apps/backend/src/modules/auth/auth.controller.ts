import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthResponse, AuthTokens } from '@bayan/shared';
import { CurrentClient } from '../../common/decorators/current-client.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthenticatedClientWithRefreshToken } from './strategies/jwt-refresh.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new Bayan client (business owner) account' })
  register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Log in with email and password' })
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exchange a valid refresh token for a new token pair' })
  refresh(@CurrentClient() client: AuthenticatedClientWithRefreshToken): Promise<AuthTokens> {
    return this.authService.refreshTokens(client.id, client.refreshToken);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke the current refresh token' })
  async logout(@CurrentClient() client: AuthenticatedClientWithRefreshToken): Promise<void> {
    await this.authService.logout(client.id);
  }
}
