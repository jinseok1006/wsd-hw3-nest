import { SetMetadata } from "@nestjs/common";

export const SkipGlobalCache = () => SetMetadata("skip-global-cache", true);
