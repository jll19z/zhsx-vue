<template>
  <el-dialog
    :model-value="dialogVisible"
    title="Tips"
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
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="ruleForm.mobile" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
const emits = defineEmits(['update:modelValue'])

const handleClose = () => {
  emits('update:modelValue', false)
}

const ruleFormRef = ref(null)
const ruleForm = ref({
  username: '',
  password: '',
  email: '',
  mobile: ''
})
</script>
