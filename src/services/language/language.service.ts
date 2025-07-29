import request from '../../library/axios/request';

class LanguageService {
  ENDPOINT = '/translations';
  public async fetchTranslations(language: string): Promise<any> {
    const url = `${this.ENDPOINT}/${language}`;
    return request({ url, method: 'GET' }).then((res: any) => {
      return res.data;
    });
  }
}

export const languageService = new LanguageService();
