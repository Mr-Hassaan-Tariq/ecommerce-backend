import { Injectable } from '@nestjs/common';

@Injectable()
export class CseriesService {
  constructor() { }

  async generateApiUrl(
    cSeries: number,
    endpoint: string,
    id = null,
    param2: string | undefined = undefined,
    queryParam: string | undefined = undefined,
    value: number | undefined = undefined,
  ) {
    let API_KEY = '';
    let API_SECRET = '';
    let URL = process.env.URL;
    if (cSeries == 1) {
      API_KEY = process.env.API_KEY;
      API_SECRET = process.env.API_SECRET;
    }
    if (cSeries == 2) {
      API_KEY = process.env.DISPOLABS_API_KEY;
      API_SECRET = process.env.DISPOLABS_API_SECRET;
    }

    let url = `https://${API_KEY}:${API_SECRET}@${URL}/${endpoint}`;

    if (id) {
      url += `/${id}`;
    }
    if (param2) {
      url += `/${param2}`;
    }
    url += '.json';
    if (queryParam) {
      url += `?${queryParam}=${value}`;
    }
    return url;
  }
}
