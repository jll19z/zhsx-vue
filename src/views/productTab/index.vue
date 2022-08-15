<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入搜索内容"
          clearable
          v-model="queryForm.tabTypename"
        ></el-input>
      </el-col>

      <el-button type="primary" :icon="Search" @click="initGetTab"
        >搜索</el-button
      >
      <el-button type="primary" @click="HandleDialog(row)">添加</el-button>
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
        <template v-slot="{ row }" v-if="item.prop === 'tabImg'">
          <img :src="row.tabImg" width="100" height="100" />
        </template>

        <template #default="{ row }" v-else-if="item.prop === 'actions'">
          <el-button
            type="success"
            size="small"
            :icon="Edit"
            @click="HandleDialog(row)"
          ></el-button>

          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="DeleteTab(row.tabType)"
          ></el-button>
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
  <Dialog
    v-model="dialogVisible"
    :dialogTitle="dialogTitle"
    :dialogTableValue="dialogTableValue"
    @initGetTab="initGetTab"
  />
</template>

<script setup>
import { ref } from 'vue'
import { getTabList, DeleteTabById } from '@/api/productTab'
import { options } from './options'
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Dialog from './components/dialog.vue'
const pagenum = ref(0)
const pagesize = ref(10)
const total = ref(0)
const queryForm = ref({})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const tableData = ref([])
const dialogTableValue = ref({})
const initGetTab = async () => {
  const res = await getTabList(pagenum.value, pagesize.value, queryForm.value)
  console.log(res)
  tableData.value = res.rows
  total.value = res.total
}
initGetTab()
const handleSizeChange = (pageSize) => {
  pagenum.value = 1
  pagesize.value = pageSize
  initGetTab()
}
const handleCurrentChange = (pageNum) => {
  pagenum.value = pageNum
  initGetTab()
}

const resetForm = () => {
  queryForm.value = {}
  initGetTab()
}

const HandleDialog = (row) => {
  console.log(row)
  if (row) {
    dialogTitle.value = '编辑商品'
    dialogTableValue.value = JSON.parse(JSON.stringify(row))
    dialogVisible.value = true
  } else {
    dialogTitle.value = '添加商品'
    dialogTableValue.value = {}
    dialogVisible.value = true
  }
}
const DeleteTab = async (id) => {
  // console.log(id)

  ElMessageBox.confirm('确定删除吗，删除后无法恢复', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await DeleteTabById(id)
      initGetTab()
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消'
      })
    })
}
</script>

<style lang="scss" scoped></style>
