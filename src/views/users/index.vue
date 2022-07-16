<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入搜索内容"
          clearable
          v-model="queryForm.username"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initGetUser"
        >搜索</el-button
      >
      <el-button type="primary" @click="HandleDialog">添加</el-button>
      <el-button type="primary" @click="resetForm">重置</el-button>
    </el-row>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        :width="item.width"
        :prop="item.prop"
        :label="item.label"
        v-for="(item, index) in options"
        :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'mg_state'">
          <el-switch v-model="row.mg_state"></el-switch>
        </template>

        <template v-slot="{ row }" v-else-if="item.prop === 'avatar'">
          <img :src="row.avatar" width="100" height="100" />
        </template>

        <template #default v-else-if="item.prop === 'actions'">
          <el-button type="success" size="small" :icon="Edit"></el-button>
          <el-button type="warning" size="small" :icon="Setting"></el-button>
          <el-button type="danger" size="small" :icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:currentPage="queryForm.pagenum"
      v-model:page-size="queryForm.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <Dialog v-model="dialogVisible" />
</template>

<script setup>
import { ref } from 'vue'
import { Search, Edit, Setting, Delete } from '@element-plus/icons-vue'
import { getUser } from '@/api/users'
import { options } from './options'
import Dialog from './components/dialog.vue'
const pagenum = ref(1)
const pagesize = ref(5)
const total = ref(0)
const queryForm = ref({})

const dialogVisible = ref(false)
const tableData = ref([])

const initGetUser = async () => {
  const res = await getUser(pagenum.value, pagesize.value, queryForm.value)
  console.log(res)
  tableData.value = res.rows
  total.value = res.total
}
initGetUser()

const handleSizeChange = (pageSize) => {
  pagenum.value = 1
  pagesize.value = pageSize
  initGetUser()
}
const handleCurrentChange = (pageNum) => {
  pagenum.value = pageNum
  initGetUser()
}
const HandleDialog = () => {
  dialogVisible.value = true
}
const resetForm = () => {
  queryForm.value = {}
  initGetUser()
}
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}
</style>
