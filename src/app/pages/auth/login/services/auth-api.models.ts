import { RoleId } from '../../../../core/access-control/role-permissions';

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly accessToken: string;
  readonly user: {
    readonly id: string;
    readonly roleId: RoleId;
  };
}
