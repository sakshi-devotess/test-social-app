import { clientTypes } from '../../config/constants';
import request from '../../library/axios/request';
import { IChangePassword, ILogin, IResetPassword, ISignUp } from './auth.model';

class AuthApi {
  ENDPOINT = '/auth';

  async signUp(data: ISignUp): Promise<any> {
    const url = `${this.ENDPOINT}/sign-up`;
    return request({ url, method: 'POST', data }).then((res: any) => {
      return res?.data;
    });
  }

  async signIn(data: ILogin): Promise<any> {
    const url = `${this.ENDPOINT}/login`;
    return request({ url, method: 'POST', data }).then((res: any) => {
      return res?.data;
    });
  }

  public async refreshToken(refreshToken: string): Promise<any> {
    const url = `${this.ENDPOINT}/refresh`;
    return request({
      url,
      method: 'POST',
      data: { refresh_token: refreshToken, clientType: clientTypes.MOBILE },
      headers: { 'X-RefreshToken': true },
    }).then((res) => {
      return res?.data;
    });
  }

  public async forgotPassword(username: string): Promise<any> {
    const data = { username: username };
    const url = `${this.ENDPOINT}/forgot-password`;
    return request({ url, method: 'POST', data }).then((res: any) => {
      return res.data;
    });
  }

  public async resetPassword(data: IResetPassword): Promise<any> {
    const url = `${this.ENDPOINT}/reset-password`;
    return request({ url, method: 'POST', data }).then((res: any) => {
      return res.data;
    });
  }

  public async changeMyPassword(data: IChangePassword): Promise<any> {
    const url = `${this.ENDPOINT}/change-my-password`;
    return request({ url, method: 'POST', data }).then((res: any) => {
      return res.data;
    });
  }
}

const authApiInstance = new AuthApi();
export default authApiInstance;
