import { User } from '@prisma/client';
import { UserAuthResponse } from '../dto/UserAuthResponse';

export const mapToUserAuthResponseFromUser = (
  user: User,
  access_token: string,
) => {
  const userAuthResponse: UserAuthResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    state: user.state,
    accessToken: access_token,
  };

  return userAuthResponse;
};
