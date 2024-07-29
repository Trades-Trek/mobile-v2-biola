import { SetMetadata } from '@nestjs/common';

export const hasFeatures = (...hasFeatures: string[]) => SetMetadata('features', hasFeatures);