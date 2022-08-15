<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入订单号"
          clearable
          v-model="queryForm.orderNo"
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
        <template v-slot="{ row }" v-if="item.prop === 'productImg'">
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
</template>

<script setup>
import { ref } from 'vue'
import { options } from './options2'
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { getOrderDetail } from '@/api/orderDetail'
import { useRoute } from 'vue-router'

const pagenum = ref(0)
const pagesize = ref(10)
const total = ref(0)
const queryForm = ref({})

const tableData = ref([])
const route = useRoute()
const orderNo = route.query.orderNo
// console.log('sssssssssssssssss')
// console.log(route.query.orderNo)
const detailInfo = () => {
  if (orderNo) {
    queryForm.value.orderNo = orderNo
    initGetDetail()
  }
}
const initGetDetail = async () => {
  const res = await getOrderDetail(
    pagenum.value,
    pagesize.value,
    queryForm.value
  )
  console.log(res)
  tableData.value = res.rows
  total.value = res.total
}
initGetDetail()
detailInfo()
const handleSizeChange = (pageSize) => {
  pagenum.value = 1
  pagesize.value = pageSize
  initGetDetail()
}
const handleCurrentChange = (pageNum) => {
  pagenum.value = pageNum
  initGetDetail()
}

const resetForm = () => {
  queryForm.value = {}
  initGetDetail()
}
</script>

<style lang="scss" scoped></style>
