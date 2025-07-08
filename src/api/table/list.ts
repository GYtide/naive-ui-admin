import { Alova } from '@/utils/http/alova/index';

//获取table
export function getTableList(params) {
  console.log('getTableList', Alova.Get('/table/list', { params }));
  return Alova.Get('/table/list', { params });
}
