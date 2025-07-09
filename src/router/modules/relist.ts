import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { TableOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/relist',
    name: 'Relist',
    redirect: '/relist',
    component: Layout,
    meta: {
      title: '列表页面',
      icon: renderIcon(TableOutlined),
      sort: 1,
    },
    children: [
      {
        path: 'relist',
        name: 'relist',
        meta: {
          title: '人员列表',
        },
        component: () => import('@/views/relist/index.vue'),
      }
    ],
  },
];

export default routes;
