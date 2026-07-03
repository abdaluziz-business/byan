import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/** Parses optional numeric query params (e.g. pagination), passing `undefined` through untouched. */
@Injectable()
export class ParseOptionalIntPipe implements PipeTransform<string | undefined, number | undefined> {
  transform(value: string | undefined, metadata: ArgumentMetadata): number | undefined {
    if (value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new BadRequestException(`${metadata.data ?? 'value'} must be a number`);
    }

    return parsed;
  }
}
