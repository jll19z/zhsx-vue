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
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:9090/fileoss/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="权限" prop="positions">
        <el-select
          v-model="ruleForm.positions"
          class="m-2"
          placeholder="Select"
        >
          <el-option
            v-for="item in SelectList"
            :key="item.id"
            :label="item.positionName"
            :value="item.id"
          />
        </el-select>
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
import { positionList } from '@/api/UserPositon'
import { AddUser, UserUpdateById } from '@/api/users'

const emits = defineEmits(['update:modelValue', 'initGetUser'])
const ruleFormRef = ref(null)
const ruleForm = ref({
  id: '',
  username: '',
  password: '',
  avatar: '',
  positions: ''
})

const saveOrUpdate = ref('0')

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
// 获取职位列表 渲染在select选择器
const SelectList = ref({})
const getPositionList = async () => {
  const res = await positionList()
  // console.log(res.plist)
  SelectList.value = res.plist
}
getPositionList()
// 定义图片回显变量imageUrl 图片上传成功 回显图片
const imageUrl = ref('')
// 上传图片成功回调函数
const handleAvatarSuccess = (res) => {
  // console.log(res.data.url)
  imageUrl.value = res.data.url
  ruleForm.value.avatar = res.data.url
}

const handleOk = async () => {
  console.log(ruleForm)
  if (ruleForm.value.id) {
    console.log('update')
    // console.log(ruleForm.value.positions)
    await UserUpdateById(ruleForm.value)
  } else {
    console.log('add')
    await AddUser(ruleForm.value)
  }

  handleClose()
  emits('initGetUser')
}

watch(
  () => props.dialogTableValue,
  () => {
    const ValueObj = toRaw(props.dialogTableValue)
    imageUrl.value = ValueObj.avatar
    saveOrUpdate.value = 1
    ruleForm.value = props.dialogTableValue
    console.log('-------------')
    console.log(ruleForm.value)
    console.log('-------------')
  },
  { deep: true, immediate: true }
)
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

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
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
