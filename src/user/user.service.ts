import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Order } from 'src/schemas/order.schema';
import { BotContext } from 'src/telebot/basic/common/bot.context';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addOrUpdateUserMiddleware(ctx: BotContext) {
    // this context is loosing after babel compile, strange bug,
    let updatedUser = null;
    const telegramUser = ctx.from;
    const user = await this.userModel.findOne({ id: telegramUser.id }).exec();
    const adaptedUser = {
      firstName: telegramUser.first_name,
      isBot: telegramUser.is_bot,
      id: telegramUser.id,
      username: telegramUser.username,
    };
    if (user) {
      // update
      updatedUser = new User({
        ...user,
        ...adaptedUser,
        appJoins: user.appJoins,
      });
      await this.userModel
        .updateOne({ id: telegramUser.id }, { $set: updatedUser })
        .exec();
    } else {
      // add
      updatedUser = new User(adaptedUser);
      await this.userModel.create(updatedUser);
    }
    ctx.session.user = updatedUser;
  }

  async addOrUpdateUser({ phone, name }): Promise<UserDocument> {
    // this context is loosing after babel compile, strange bug,
    let updatedUser = null;
    const user = await this.userModel.findOne({ phone });
    if (user) {
      // update
      updatedUser = new User({
        ...user,
        appJoins: user.appJoins + 1,
      });
      // updatedUser.join();
      return this.userModel
        .findOneAndUpdate(
          { phone },
          { $set: updatedUser },
          {
            new: true,
            useFindAndModify: false,
          },
        )
        .exec();
    } else {
      // add
      const user = new this.userModel(new User({ phone, firstName: name }));
      user.save();
      return user;
    }
  }

  async getUsers() {
    return this.userModel.find().exec();
  }

  async updateRefs(user: User, order: Order) {
    // update parent who send invite
    // if user uses bonus
    if (order.hasBonus()) {
      if (user.hasUnusedInvitationBonus) {
        // update
        await this.userModel
          .updateOne(
            { id: user.id },
            { $set: { hasUnusedInvitationBonus: false } },
          )
          .exec();
        await this.userModel
          .updateOne(
            {
              id: user.invitedBy,
              refs: { $exists: true },
              'refs.id': user.id,
            },
            {
              $set: {
                'refs.$.active': true,
                'refs.$.hasUnusedBonus': false,
              },
            },
          )
          .exec();
        return;
      }
      if (user.bonusCount) {
        const usedBonuses = order.products
          .filter((v) => v.bonus)
          .reduce((acc, item) => acc + item.count, 0);
        await this.userModel
          .updateOne({ id: user.id }, { $inc: { bonusCount: -usedBonuses } })
          .exec();
        return;
      }
    }

    // activate bonus for first order
    if (user.orders && user.orders.length === 0 && user.invitedBy) {
      await this.userModel
        .updateOne(
          { id: user.id },
          { $set: { has_unused_invitation_bonus: true } },
        )
        .exec();
      await this.userModel
        .updateOne(
          {
            id: user.invitedBy,
            'refs.id': user.id,
          },
          {
            $set: { 'refs.$.active': true, 'refs.$.hasUnusedBonus': true },
            $inc: { bonus_count: 1 },
          },
        )
        .exec();
    }
  }

  async addReferral(ctx) {
    const currentUser = ctx.update.message.from;
    const ref = {
      id: currentUser.id,
      active: false,
      hasUnusedBonus: true,
    };
    const payload = parseInt(ctx.startPayload);
    if (typeof payload !== 'number') {
      return;
    }
    const inviter = await this.userModel.findOne({ id: payload }).exec();
    if (inviter.refs && inviter.refs.find((v) => v.id === currentUser.id)) {
      return;
    }
    await this.userModel
      .updateOne({ id: payload }, { $push: { refs: ref } })
      .exec();
    await this.userModel
      .updateOne(
        { id: parseInt(currentUser.id) },
        { $set: { invitedBy: payload.toString() } },
      )
      .exec();
    ctx.session.user.invitedBy = payload;
  }
}
