<template>
  <n-card :bordered="false">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>
  </n-card>
  <n-card :bordered="false" class="mt-3">
    <BasicTable :columns="columns" :request="loadDataTable" :row-key="(row: ListData) => row.id" ref="actionRef"
      :actionColumn="actionColumn" @update:checked-row-keys="onCheckedRow" :scroll-x="1090" :striped="true">
      <!-- <template #tableTitle>
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template> -->

      <template #toolbar> </template>
    </BasicTable>

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
      <n-form :model="formParams" :rules="rules" ref="formRef" label-placement="left" :label-width="80" class="py-4">
        <n-form-item label="名称" path="name">
          <n-input placeholder="请输入名称" v-model:value="formParams.name" />
        </n-form-item>
        <n-form-item label="地址" path="address">
          <n-input type="textarea" placeholder="请输入地址" v-model:value="formParams.address" />
        </n-form-item>
        <n-form-item label="日期" path="date">
          <n-date-picker type="datetime" placeholder="请选择日期" v-model:value="formParams.date" />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import { h, reactive, ref, onMounted } from 'vue';
import { BasicTable, TableAction } from '@/components/Table';
import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
import { columns, ListData } from './columns';
import { useRouter } from 'vue-router';
import { type FormRules } from 'naive-ui';

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'         // 正确名称
import VueHook from 'alova/vue'

const rules: FormRules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入名称',
  },
  address: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入地址',
  },
  date: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择日期',
  },
};

const schemas: FormSchema[] = [
  {
    field: 'name',
    labelMessage: '这是一个提示',
    component: 'NInput',
    label: '姓名',
    componentProps: {
      placeholder: '请输入姓名',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
  },
];

const router = useRouter();
const formRef: any = ref(null);
const actionRef = ref();

const showModal = ref(false);
const formBtnLoading = ref(false);
const formParams = reactive({
  name: '',
  address: '',
  date: null,
});

const actionColumn = reactive({
  width: 220,
  title: '操作',
  key: 'action',
  fixed: 'right',
  render(record) {
    return h(TableAction as any, {
      style: 'button',
      actions: [
        {
          label: '删除',
          onClick: handleDelete.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true;
          },
          // 根据权限控制是否显示: 有权限，会显示，支持多个
          auth: ['basic_list'],
        },
        {
          label: '编辑',
          onClick: handleEdit.bind(null, record),
          ifShow: () => {
            return true;
          },
          auth: ['basic_list'],
        },
      ],
      dropDownActions: [
        {
          label: '启用',
          key: 'enabled',
          // 根据业务控制是否显示: 非enable状态的不显示启用按钮
          ifShow: () => {
            return true;
          },
        },
        {
          label: '禁用',
          key: 'disabled',
          ifShow: () => {
            return true;
          },
        },
      ],
      select: (key) => {
        window['$message'].info(`您点击了，${key} 按钮`);
      },
    });
  },
});

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  labelWidth: 80,
  schemas,
});



const alovaInstance = createAlova({
  baseURL: '/',                // public 目录作为基础路径
  statesHook: VueHook,
  requestAdapter: adapterFetch(),  // ✅ 使用 fetch 适配器
  responded: response => response.json(), // 可选：自动 parse JSON
})



const loadDataTable = (params) => {
  console.log('加载表格数据', params);
  return alovaInstance.Get('/data/graph.json', {
    transform: (data: any) => {
      return {
        itemCount: data.nodes.length,
        list:data.nodes,
        page:params.page,
        pageSize: params.pageSize,
        pageCount: Math.ceil(data.nodes.length / params.pageSize),

      }
    }
  })
}

function onCheckedRow(rowKeys) {
  console.log(rowKeys);
}

function reloadTable() {
  actionRef.value.reload();
}

function confirmForm(e) {
  e.preventDefault();
  formBtnLoading.value = true;
  formRef.value.validate((errors) => {
    if (!errors) {
      window['$message'].success('新建成功');
      setTimeout(() => {
        showModal.value = false;
        reloadTable();
      });
    } else {
      window['$message'].error('请填写完整信息');
    }
    formBtnLoading.value = false;
  });
}

function handleEdit(record: Recordable) {
  console.log('点击了编辑', record);
  router.push({ name: 'basic-info', params: { id: record.id } });
}

function handleDelete(record: Recordable) {
  console.log('点击了删除', record);
  window['$message'].info('点击了删除');
}

function handleSubmit(values: Recordable) {
  console.log(values);
  reloadTable();
}

function handleReset(values: Recordable) {
  console.log(values);
}
</script>

<style lang="less" scoped></style>
