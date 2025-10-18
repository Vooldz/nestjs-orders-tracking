import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      const apiKey = request.headers['x-api-key'] as string;

      if (!apiKey) {
        throw new UnauthorizedException('API Key is required');
      }

      if (apiKey !== process.env.API_KEY) {
        throw new UnauthorizedException('Invalid API Key');
      }

      return true;
    }

    return false;
  }
}
