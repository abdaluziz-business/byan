import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponse, AuthTokens } from '@bayan/shared';
import { AppConfig } from '../../config/configuration';
import { PrismaService } from '../../prisma/prisma.service';
import { toClientDto } from '../clients/clients.mapper';
import { DEFAULT_SITE_SECTIONS, DEFAULT_SITE_THEME } from '../sites/site-defaults';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.prisma.client.findUnique({ where: { email: dto.email } });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const client = await this.prisma.client.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        businessName: dto.businessName,
        sites: {
          create: {
            theme: { ...DEFAULT_SITE_THEME, siteName: dto.businessName, siteNameAr: dto.businessName } as object,
            sections: DEFAULT_SITE_SECTIONS as object,
          },
        },
      },
    });

    const tokens = await this.issueTokens(client.id, client.email);
    await this.persistRefreshToken(client.id, tokens.refreshToken);

    return { ...tokens, client: toClientDto(client) };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const client = await this.prisma.client.findUnique({ where: { email: dto.email } });

    if (!client || !(await bcrypt.compare(dto.password, client.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!client.isActive) {
      throw new UnauthorizedException('This account has been deactivated');
    }

    const tokens = await this.issueTokens(client.id, client.email);
    await this.persistRefreshToken(client.id, tokens.refreshToken);

    return { ...tokens, client: toClientDto(client) };
  }

  async refreshTokens(clientId: string, refreshToken: string): Promise<AuthTokens> {
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });

    if (!client?.hashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const matches = await bcrypt.compare(refreshToken, client.hashedRefreshToken);

    if (!matches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.issueTokens(client.id, client.email);
    await this.persistRefreshToken(client.id, tokens.refreshToken);

    return tokens;
  }

  async logout(clientId: string): Promise<void> {
    await this.prisma.client.update({
      where: { id: clientId },
      data: { hashedRefreshToken: null },
    });
  }

  private async issueTokens(clientId: string, email: string): Promise<AuthTokens> {
    const payload = { sub: clientId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.accessSecret', { infer: true }),
        expiresIn: this.configService.get('jwt.accessExpiresIn', { infer: true }),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret', { infer: true }),
        expiresIn: this.configService.get('jwt.refreshExpiresIn', { infer: true }),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async persistRefreshToken(clientId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.client.update({ where: { id: clientId }, data: { hashedRefreshToken } });
  }
}
