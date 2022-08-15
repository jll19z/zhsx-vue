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
      <el-form-item label="分类名称" prop="tabTypename">
        <el-input v-model="ruleForm.tabTypename" />
      </el-form-item>
      <el-form-item label="显示优先级" prop="tabRank">
        <el-input v-model="ruleForm.tabRank" />
      </el-form-item>

      <el-form-item label="图片" prop="tabImg">
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
import { AddTab, UpdateTabById } from '@/api/productTab'
const emits = defineEmits(['update:modelValue', 'initGetTab'])
const ruleFormRef = ref(null)
const imageUrl = ref('')
const ruleForm = ref({
  tabTypename: '',
  tabRank: '',
  tabImg: ''
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
  ruleForm.value.tabImg = res.data.url
}

const handleOk = async () => {
  console.log(ruleForm)
  if (ruleForm.value.tabType) {
    console.log('update')
    // console.log(ruleForm.value.positions)
    await UpdateTabById(ruleForm.value)
  } else {
    console.log('add')
    await AddTab(ruleForm.value)
  }
  console.log('----5555555555555')
  emits('initGetTab')
  console.log('----5555555555555')
  handleClose()
}

watch(
  () => props.dialogTableValue,
  () => {
    const ValueObj = toRaw(props.dialogTableValue)
    console.log('ValueObj')
    console.log(ValueObj)
    imageUrl.value = ValueObj.tabImg
    ruleForm.value = props.dialogTableValue
    console.log(ruleForm.value)
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  transition: var(--el-transition-duration-fast);
}
.avatar {
  width: 130px;
  height: 130px;
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
