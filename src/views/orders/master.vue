<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="5">
        <el-input
          placeholder="请输入订单号"
          clearable
          v-model="queryForm.orderNo"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-input
          placeholder="请输入电话号"
          clearable
          v-model="queryForm.buyerPhone"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initGetTab"
        >搜索</el-button
      >

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

        <template v-slot="{ row }" v-else-if="item.prop === 'payStatus'">
          <el-tag type="success" v-if="row.payStatus === 1">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>

        <template v-slot="{ row }" v-else-if="item.prop === 'orderStatus'">
          <el-tag type="success" v-if="row.orderStatus === 1">已出单</el-tag>
          <el-tag type="danger" v-else>未出单</el-tag>
        </template>

        <template #default="{ row }" v-else-if="item.prop === 'actions'">
          <el-button
            v-if="row.payStatus == 1 && row.orderStatus == 0"
            size="small"
            type="success"
            @click="orderOk(row.orderId)"
            >出单</el-button
          >
          <el-button
            type="success"
            size="small"
            :icon="Edit"
            @click="orderDetail(row.orderNo)"
          ></el-button>

          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="DeleteOrder(row.orderNo)"
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
</template>

<script setup>
import { ref } from 'vue'
import { options } from './options1'
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getOrderInfo,
  DeleteOrderByNo,
  UpdateOrderById
} from '@/api/orderMaster'
import { useRouter } from 'vue-router'

const pagenum = ref(0)
const pagesize = ref(10)
const total = ref(0)
const queryForm = ref({})
const Form = ref({
  orderId: '',
  orderStatus: 1
})
const tableData = ref([])

const initGetOrder = async () => {
  const res = await getOrderInfo(pagenum.value, pagesize.value, queryForm.value)
  console.log(res)
  tableData.value = res.rows
  total.value = res.total
}
initGetOrder()
const handleSizeChange = (pageSize) => {
  pagenum.value = 1
  pagesize.value = pageSize
  initGetOrder()
}
const handleCurrentChange = (pageNum) => {
  pagenum.value = pageNum
  initGetOrder()
}

const resetForm = () => {
  queryForm.value = {}
  initGetOrder()
}
const router = useRouter()
const orderDetail = (orderNo) => {
  router.push({ path: 'detail', query: { orderNo: orderNo } })
}
const orderOk = (id) => {
  Form.value.orderId = id
  ElMessageBox.confirm('确定出单', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'success'
  })
    .then(async () => {
      await UpdateOrderById(Form.value)
      initGetOrder()
      ElMessage({
        type: 'success',
        message: '出单成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消'
      })
    })
}

const DeleteOrder = async (id) => {
  // console.log(id)

  ElMessageBox.confirm('确定删除吗，删除后无法恢复', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await DeleteOrderByNo(id)
      initGetOrder()
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
