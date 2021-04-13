import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Text, TextSchema } from 'src/schemas/text.schema';
import { TextController } from './text.controller';
import { TextService } from './text.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Text.name,
        schema: TextSchema,
      },
    ]),
  ],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
