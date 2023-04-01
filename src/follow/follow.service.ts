import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FollowDto } from 'src/dto/follow-dto/follow-dto';
import { IFollow } from 'src/interface/follow.interface';

@Injectable()
export class FollowService {
  constructor(@InjectModel('Follow') private followModel: Model<IFollow>) {}

  async createFollow(followDto: FollowDto): Promise<IFollow> {
    const follow = new this.followModel(followDto);
    return follow.save();
  }

  async getAllFollows(followerId: string): Promise<IFollow[]> {
    const follows = await this.followModel.find({ followerId: followerId });
    if (!follows || follows.length == 0) {
      throw new NotFoundException('Follows Not Found');
    }
    return follows;
  }

  async getAllFollowers(followingId: string): Promise<IFollow[]> {
    const follows = await this.followModel.find({ followingId: followingId });
    if (!follows || follows.length == 0) {
      throw new NotFoundException('Follows Not Found');
    }
    return follows;
  }

  async deleteFollow(followerId: string, followingId: string) {
    const follow = await this.followModel.findOneAndDelete({
      followerId: followerId,
      followingId: followingId,
    });

    if (!follow) {
      throw new NotFoundException('Follow not found');
    }
    return follow;
  }

  async deleteFollower(followerId: string, followingId: string) {
    const follow = await this.followModel.findOneAndDelete({
      followerId: followerId,
      followingId: followingId,
    });

    if (!follow) {
      throw new NotFoundException('Follow not found');
    }
    return follow;
  }
}