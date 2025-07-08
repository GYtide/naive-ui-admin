import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
export interface ListData {
  id: number;
  name: string;
  sex: string;
  avatar: string;
  email: string;
  city: string;
  status: string;
  type: string;
  createDate: string;
}

const sexMap = {
  male: '男',
  female: '女',
  unknown: '未知',
};

export const columns: BasicColumn<ListData>[] = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: '名称',
    key: 'name',
  },
  // {
  //   title: '头像',
  //   key: 'avatar',
  //   render(record) {
  //     return h(NAvatar, {
  //       size: 50,
  //       src: record.avatar,
  //     });
  //   },
  // },
  {
    title: '性别',
    key: 'gender',
    // render(record) {
    //   return h(
    //     NTag,
    //     {
    //       type: record.sex === 'male' ? 'info' : 'error',
    //     },
    //     {
    //       default: () => sexMap[record.sex],
    //     }
    //   );
    // },
  },
  {
    title: '年龄',
    key: 'age',
    width: 220,
  },
  {
    title: '邮箱',
    key: 'email',
    width: 220,
  },
  {
    title: '电话',
    key: 'phone',
  },
];
