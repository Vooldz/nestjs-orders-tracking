import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '12', 10);
    const hashed = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = new this.userModel({
      ...createUserDto,
      password: hashed,
    });
    const savedUser = await user.save();
    return savedUser.toObject();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean().exec();
  }
}
