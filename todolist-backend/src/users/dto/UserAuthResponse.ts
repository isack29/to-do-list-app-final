import { State } from '@prisma/client';

export class UserAuthResponse {
  id: number;
  name: string;
  email: string;
  state: State;
  accessToken: string;
}
