import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { ReadUserDto } from '../users/dto/read-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ReadUserDto | null> {
    const user = await this.usersService.getUserByLogin(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return plainToInstance(ReadUserDto, user);
    }

    return null;
  }

  async login(loginData: LoginUserDto) {
    const user: ReadUserDto | null = await this.validateUser(
      loginData.username,
      loginData.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
