// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const { password, ...rest } = data;
  
    let updateData: Partial<UpdateUserDto & { password?: string }> = rest;
    if (password) {
      const hashedPassword: string = await bcrypt.hash(password, 10);
      updateData = {
        ...rest,
        password: hashedPassword,
      };
    }
  
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
  

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
