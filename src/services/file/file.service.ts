import request from '../../library/axios/request';

class FileServiceApi {
  ENDPOINT = '/file';

  public async getFile(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/get-image/${id}`;
    return request({ url, method: 'GET' }).then((res: any) => {
      return res?.data;
    });
  }
}

const fileApiInstance = new FileServiceApi();
export default fileApiInstance;
