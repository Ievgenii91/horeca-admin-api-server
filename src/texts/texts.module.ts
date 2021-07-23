import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Text, TextSchema } from 'src/schemas/text.schema';
import { TextsController } from './texts.controller';
import { TextsService } from './texts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Text.name,
        schema: TextSchema,
      },
    ]),
  ],
  controllers: [TextsController],
  providers: [TextsService],
  exports: [TextsService],
})
export class TextsModule {}
