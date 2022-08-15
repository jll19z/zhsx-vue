<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入搜索内容"
          clearable
          v-model="queryForm.bannerInfo"
        ></el-input>
      </el-col>

      <el-button type="primary" :icon="Search" @click="initGetBanner"
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
        <template v-slot="{ row }" v-if="item.prop === 'mg_state'">
          <el-switch v-model="row.mg_state"></el-switch>
        </template>

        <template v-slot="{ row }" v-else-if="item.prop === 'bannerImg'">
          <img :src="row.bannerImg" width="300" height="280" />
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
    @initGetBanner="initGetBanner"
  />
</template>

<script setup>
import { ref } from 'vue'
import { getBanner, DeleteBannerById } from '@/api/banner'
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
const initGetBanner = async () => {
  const res = await getBanner(pagenum.value, pagesize.value, queryForm.value)
  console.log(res)
  tableData.value = res.rows
  total.value = res.total
}
initGetBanner()
const handleSizeChange = (pageSize) => {
  pagenum.value = 1
  pagesize.value = pageSize
  initGetBanner()
}
const handleCurrentChange = (pageNum) => {
  pagenum.value = pageNum
  initGetBanner()
}

const resetForm = () => {
  queryForm.value = {}
  initGetBanner()
}

const HandleDialog = (row) => {
  console.log(row)
  if (row) {
    dialogTitle.value = '编辑轮播图'
    dialogTableValue.value = JSON.parse(JSON.stringify(row))
    dialogVisible.value = true
  } else {
    dialogTitle.value = '添加轮播图'
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
      await DeleteBannerById(id)
      initGetBanner()
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
