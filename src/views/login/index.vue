<template>
  <div class="login-container">
    <div>
      <el-form ref="formRef" :model="form" class="login-form" :rules="rules">
        <div class="title-container">
          <h3 class="title">{{ $t('login.title') }}</h3>
        </div>
        <el-form-item prop="username">
          <svg-icon icon="user" class="svg-container"></svg-icon>
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <svg-icon icon="password" class="svg-container"></svg-icon>
          <el-input v-model="form.password" :type="passwordType"></el-input>
          <svg-icon
            :icon="passwordType === 'password' ? 'eye' : 'eye-open'"
            @click="changeType"
          ></svg-icon>
        </el-form-item>
        <div class="login-button">
          <el-button type="primary" class="button-style" @click="handleLogin"
            >登录</el-button
          >
          <el-button type="primary" class="button-style" @click="wxHandleLogin"
            >微信扫码登录</el-button
          >
        </div>
      </el-form>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
      :before-close="handleClose"
    >
      <el-image
        style="width: 300px; height: 300px"
        :src="QrCodeurl"
        fit="scale-down"
      />
      <el-button type="primary" @click="getOpenId">确认</el-button>
    </el-dialog>

    <el-dialog v-model="dialogVisible2" title="请绑定账号">
      <el-form :model="bindform">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="bindform.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="bindform.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="bindUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { QrCodeLogin, getOpenIdApi, loginJudge, getPubkey } from '@/api/login'
import { UserFind, UserUpdateById } from '@/api/users'
import { ElMessage } from 'element-plus'
import JsEncrypt from 'jsencrypt'
const store = useStore()
const form = ref({
  username: 'admin',
  password: '123456'
})
const bindform = ref({
  id: '',
  vueopenid: '',
  username: '',
  password: ''
})
const rules = ref({
  username: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur'
    }
  ]
})

const pubkey = ref('')
const pwdJm = async () => {
  const res = await getPubkey()
  console.log(res.pk)
  pubkey.value = res.pk
}
pwdJm()

const formRef = ref(null)
const handleLogin = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      var encrypt = new JsEncrypt()
      encrypt.setPublicKey(pubkey.value)
      var encodeData = encrypt.encrypt(form.value.password)
      form.value.password = encodeData
      store.dispatch('app/login', form.value)
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const sceneStr = ref('')

const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const QrCodeurl = ref('')
const openId = ref('')
const wxHandleLogin = async () => {
  dialogVisible.value = true
  console.log('------------------------------------')
  const res = await QrCodeLogin()
  sceneStr.value = res.data.sceneStr
  QrCodeurl.value =
    'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.data.ticket
  console.log(res.data)
}

const getOpenId = async () => {
  const res = await getOpenIdApi(sceneStr.value)
  console.log('---------------------------')
  console.log(res.data)
  console.log('---------------------------')
  openId.value = res.data.openId
  if (res.data.openId) {
    ElMessage({
      message: '扫码成功',
      type: 'success'
    })
    judgeL()
  }
}

const judgeL = async () => {
  const res = await loginJudge(openId.value)
  // console.log('+++++++++++++++++++++++++++++++++')
  console.log(res)
  if (res.user.id !== 0) {
    form.value.username = res.user.username
    form.value.password = res.user.password
    handleLogin()
    dialogVisible.value = false
  } else {
    dialogVisible.value = false
    dialogVisible2.value = true
  }
  // console.log('+++++++++++++++++++++++++++++++++')
}

const bindUser = async () => {
  console.log(bindform.value)
  const res = await UserFind(bindform.value)
  console.log(res)
  if (res.user.id !== 0) {
    bindform.value.id = res.user.id
    bindform.value.vueopenid = openId.value
    UserUpdateById(bindform.value)
    ElMessage({
      message: '绑定成功',
      type: 'success'
    })
    form.value.username = res.user.username
    form.value.password = res.user.password
    handleLogin()
  } else {
    ElMessage.error('账户名或密码错误')
  }
}

const passwordType = ref('password')
const changeType = () => {
  if (passwordType.value === 'password') {
    passwordType.value = 'text'
  } else {
    passwordType.value = 'password'
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 20px;

    ::v-deep .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    ::v-deep .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
      }
    }
    .login-button {
      width: 100%;
      box-sizing: border-box;
      .button-style {
        width: 253px;
      }
    }
  }

  .tips {
    font-size: 16px;
    line-height: 28px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    ::v-deep .lang-select {
      position: absolute;
      top: 4px;
      right: 0;
      background-color: white;
      font-size: 22px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .show-pwd {
    // position: absolute;
    // right: 10px;
    // top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
