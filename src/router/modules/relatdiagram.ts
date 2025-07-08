import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { CheckCircleOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/rediagram',
    name: 'Rediagram',
    redirect: '/rediagram',
    component: Layout,
    meta: {
      title: '关系图',
      icon: renderIcon(CheckCircleOutlined),
      sort: 4,
    },
    children: [
      {
        path: 'graph',
        name: 'rediagram-graph',
        meta: {
          title: '关系图',
        },
        component: () => import('@/views/relist/RelationDiagram.vue'),
      },
      {
        path: 'tree',
        name: 'rediagram-tree',
        meta: {
          title: '关系树',
        },
        component: () => import('@/views/relist/TreeDiagram.vue'),
      },
    ],
  },
];

export default routes;
