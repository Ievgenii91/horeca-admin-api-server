import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class RequiredValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || (typeof value === 'object' && !value[metadata.data])) {
      throw new BadRequestException(
        `${metadata.type} ${metadata.data} is required`,
      );
    }
    return value;
  }
}
