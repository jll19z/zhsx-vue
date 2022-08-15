<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="dialogTitle"
    width="30%"
    @close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="70px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="ruleForm.productName" />
      </el-form-item>
      <el-form-item label="商品价格" prop="productPrice">
        <el-input v-model="ruleForm.productPrice" />
      </el-form-item>
      <el-form-item label="优惠价格" prop="productPriceNow">
        <el-input v-model="ruleForm.productPriceNow" />
      </el-form-item>

      <el-form-item label="商品类型" prop="tabType">
        <el-select v-model="ruleForm.tabType" class="m-2" placeholder="Select">
          <el-option
            v-for="item in tabList"
            :key="item.tabType"
            :label="item.tabTypename"
            :value="item.tabType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:9090/fileoss/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品描述" prop="productDescription">
        <el-input v-model="ruleForm.productDescription"></el-input>
      </el-form-item>
      <el-form-item label="商品库存" prop="productStock">
        <el-input v-model="ruleForm.productStock"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleOk">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, ref, defineProps, watch, toRaw } from 'vue'
import { getProductTab } from '@/api/productTab'
import { AddProduct, UpdateProductById } from '@/api/productinfo'
const emits = defineEmits(['update:modelValue', 'initGetProduct'])
const ruleFormRef = ref(null)
const imageUrl = ref('')
const tabList = ref([])
const ruleForm = ref({
  productName: '',
  productPrice: '',
  productPriceNow: '',
  tabType: '',
  productStock: '',
  productDescription: '',
  productImg: ''
})

const props = defineProps({
  dialogTitle: {
    type: String,
    default: '',
    required: true
  },
  dialogTableValue: {
    type: Object,
    default: () => {}
  }
})

const handleClose = () => {
  // console.log(value.value)
  // console.log(ruleForm.value)
  imageUrl.value = '' // 上传的图片在取消添加后清除
  emits('update:modelValue', false)
}
// 上传图片成功回调函数
const handleAvatarSuccess = (res) => {
  // console.log(res.data.url)
  imageUrl.value = res.data.url
  ruleForm.value.productImg = res.data.url
}

const handleOk = async () => {
  console.log(ruleForm)
  if (ruleForm.value.productId) {
    console.log('update')
    // console.log(ruleForm.value.positions)
    await UpdateProductById(ruleForm.value)
  } else {
    console.log('add')
    await AddProduct(ruleForm.value)
  }
  console.log('----5555555555555')
  emits('initGetProduct')
  console.log('----5555555555555')
  handleClose()
}
// 获取分类列表 渲染到查询的选择器上
const getProductTabList = async () => {
  const res = await getProductTab()
  tabList.value = res.tablist
  console.log(res.tablist)
}
getProductTabList()

watch(
  () => props.dialogTableValue,
  () => {
    const ValueObj = toRaw(props.dialogTableValue)
    console.log('ValueObj')
    console.log(ValueObj)
    imageUrl.value = ValueObj.productImg
    ruleForm.value = props.dialogTableValue
    console.log(ruleForm.value)
  },
  { deep: true, immediate: true }
)
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  text-align: center;
}
</style>
