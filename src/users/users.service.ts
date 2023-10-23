import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: mongoose.Model<User>

  ) { }


  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.UserModel.findOne({ email: createUserDto.email });

      if (existingUser) {
        throw new Error('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const userToCreate = {
        ...createUserDto,
        password: hashedPassword,
      };

      const res = await this.UserModel.create(userToCreate);
      return res;

    } catch (error) {
      console.error("Error creating user:", error.message);
      throw new Error("Failed to create user");
    }
  }

  async findAll() {
    const users = await this.UserModel.find()
    return users;
  }

  async findOne(id: string) {
    const user = await this.UserModel.findById(id)

    if (!user) {
      throw new NotFoundException('Book not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateduser = await this.UserModel.findByIdAndUpdate(id, updateUserDto);
    return updateduser;
  }

  async remove(id: string) {
    return await this.UserModel.findByIdAndDelete(id);
  }
}
