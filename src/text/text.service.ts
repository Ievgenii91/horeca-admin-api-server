import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TextDocument, Text } from 'src/schemas/text.schema';

@Injectable()
export class TextService {
  constructor(@InjectModel(Text.name) private textModel: Model<TextDocument>) {}

  getTexts(clientId: string) {
    return this.textModel
      .findOne({ clientId })
      .projection({ _id: 0, clientId: 0, botName: 0 });
  }

  createTexts(data: Text, clientId: string) {
    delete data['botName'];
    delete data['_id'];

    return this.textModel
      .updateOne(
        {
          clientId,
        },
        { $set: data },
      )
      .exec();
  }
}
