import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SALT_ROUNDS } from './constants';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/auth/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registerUser(data: RegisterDto): Promise<IUser> {
    const { username, password } = data;

    const isExistingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (isExistingUser) {
      throw new ConflictException('This username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      username: savedUser.username,
    };
  }
}
