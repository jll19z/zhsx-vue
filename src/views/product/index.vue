<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入搜索内容"
          clearable
          v-model="queryForm.productName"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-select v-model="queryForm.tabType" class="m-2" placeholder="Select">
          <el-option
            v-for="item in tabList"
            :key="item.tabType"
            :label="item.tabTypename"
            :value="item.tabType"
          />
        </el-select>
      </el-col>

      <el-button type="primary" :icon="Search" @click="initGetProduct"
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
        <template v-slot="{ row }" v-if="item.prop === 'productStatus'">
          <el-switch
            v-model="row.productStatus"
            active-value="0"
            inactive-value="1"
            @click="swChange(row.productId)"
            v-on:change="swChangeVal"
          ></el-switch>
        </template>

        <template v-slot="{ row }" v-else-if="item.prop === 'productImg'">
          <img :src="row.productImg" width="100" height="100" />
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
            @click="DeleteUser(row.productId)"
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
    @initGetProduct="initGetProduct"
  />
</template>

<script setup>
import { ref } from 'vue'
import {
  getProductInfo,
  DeleteProductById,
  UpdateProductById
} from '@/api/productinfo'
import { getProductTab } from '@/api/productTab'
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
const tabList = ref([])
const dialogTableValue = ref({})
const Form = ref({
  productId: '',
  productStatus: ''
})
const initGetProduct = async () => {
  const res = await getProductInfo(
    pagenum.value,
    pagesize.value,
    queryForm.value
  )
  console.log(res)
  tableData.value = res.rows
  total.value = res.total
}
initGetProduct()
const handleSizeChange = (pageSize) => {
  pagenum.value = 1
  pagesize.value = pageSize
  initGetProduct()
}
const handleCurrentChange = (pageNum) => {
  pagenum.value = pageNum
  initGetProduct()
}
// 获取分类列表 渲染到查询的选择器上
const getProductTabList = async () => {
  const res = await getProductTab()
  tabList.value = res.tablist
  console.log(res.tablist)
}
getProductTabList()

const resetForm = () => {
  queryForm.value = {}
  initGetProduct()
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
const swChangeVal = (val) => {
  console.log(val)
  Form.value.productStatus = val
}
const swChange = (id) => {
  Form.value.productId = id
  console.log(Form.value)
  UpdateProductById(Form.value)
}

const DeleteUser = async (id) => {
  // console.log(id)

  ElMessageBox.confirm('确定删除吗，删除后无法恢复', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await DeleteProductById(id)
      initGetProduct()
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
