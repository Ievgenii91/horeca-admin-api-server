import { PartialType } from '@nestjs/swagger';
import { CreateTimetrackingDto } from './create-timetracking.dto';

export class UpdateTimetrackingDto extends PartialType(CreateTimetrackingDto) {}
