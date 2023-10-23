import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signIn.dto';
import { response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private UserModel: mongoose.Model<User>

    ) { }


    async login(signInDto: SignInDto){
        try {
          const user = await this.UserModel.findOne({email: signInDto.email});
    
          if (!user) {
            throw new Error('User not found');
          }
    
          const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);
    
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }
          
          return user;
    
        } catch (error) {
          console.error('Error during login:', error.message);
          throw new Error('Login failed');
        }
      }

}
