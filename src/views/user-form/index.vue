<template>
  <div class="app-container">
    <el-form v-if="form" ref="form" :model="form" label-width="120px" v-loading.fullscreen.lock="isLoading">
      <div>
        <el-col :span="24">
          <el-form-item>
            <el-button type="warning" icon="el-icon-back" @click="onGoBack">返回</el-button>
            <!--<el-button type="success"><i class="el-icon-check"></i> 保存</el-button>-->
            <el-button
              v-if="['SYSADMIN', 'HOSPITAL'].includes(form.role)"
              type="primary"
              icon="el-icon-search"
              @click="onClickViewRequiredMaterials"
            >
              查看发布的寻求
            </el-button>
            <el-button
              v-if="['SYSADMIN', 'SUPPLIER'].includes(form.role)"
              type="primary"
              icon="el-icon-search"
              @click="onClickViewSuppliedMaterials"
            >
              查看发布的供应
            </el-button>
          </el-form-item>
        </el-col>
      </div>
      <div>
        <el-col :span="24">
          <el-form-item>
            <h2>用户信息</h2>
          </el-form-item>
        </el-col>
      </div>
      <div>
        <el-col :span="11">
          <el-form-item label="昵称">
            <el-input disabled v-model="form.nickName" />
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item label="角色">
            <el-select style="width: 100%;" disabled v-model="form.role">
              <el-option
                v-for="role in Object.keys(roles)"
                :key="role"
                :label="roles[role].description"
                :value="role">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="电话">
            <el-input disabled v-model="form.phone" />
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <el-tag :type="status[form.status].type">{{ status[form.status].description }}</el-tag>
            <el-button
              v-if="form.status === 'PENDING'"
              type="success"
              size="small"
              @click="onClickVerify"
            >认证</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间">
            <div>{{ form.formattedGmtCreated }}</div>
          </el-form-item>
        </el-col>
      </div>

      <div v-if="organisation">
        <el-col :span="24">
          <el-form-item>
            <h2>{{ roles[form.role].description }}信息</h2>
          </el-form-item>
        </el-col>
      </div>
      <div v-if="organisation">
        <el-col :span="11">
          <el-form-item label="名称">
            <el-input disabled v-model="organisation.name" />
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item v-if="organisation.uniformSocialCreditCode" label="信用代码">
            <el-input disabled v-model="organisation.uniformSocialCreditCode" />
          </el-form-item>
          <el-form-item
            v-if="organisation.haveLogistics !== undefined && organisation.haveLogistics !== null"
            label="是否自备物流">
            <el-select disabled v-model="organisation.haveLogistics" style="width: 100%;">
              <el-option label="有" :value="true"></el-option>
              <el-option label="无" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系人">
            <el-input disabled v-model="organisation.contactorName" />
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input disabled v-model="organisation.contactorTelephone" />
          </el-form-item>
        </el-col>
      </div>
      <div>
        <el-col :span="24" class="buttons-bottom">
          <el-form-item>
            <el-button type="warning" icon="el-icon-back" @click="onGoBack">返回</el-button>
            <!--<el-button type="success"><i class="el-icon-check"></i> 保存</el-button>-->
            <el-button
              v-if="['SYSADMIN', 'HOSPITAL'].includes(form.role)"
              type="primary"
              icon="el-icon-search"
              @click="onClickViewRequiredMaterials"
            >
              查看发布的寻求
            </el-button>
            <el-button
              v-if="['SYSADMIN', 'SUPPLIER'].includes(form.role)"
              type="primary"
              icon="el-icon-search"
              @click="onClickViewSuppliedMaterials"
            >
              查看发布的供应
            </el-button>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getDetail, verify } from '@/api/user'
import { USER_STATUS } from '@/utils/status'
import USER_ROLE, { isHospital, isSupplier } from '@/utils/user-role'
import { parseTime } from '@/utils/'

export default {
  data() {
    return {
      id: this.$route.params['id'],
      form: null,
      status: USER_STATUS,
      roles: USER_ROLE,
      isLoading: true,
      organisation: null
    }
  },
  async created() {
    const response = await getDetail(this.id)
    this.form = Object.assign(response.data, { formattedGmtCreated: parseTime(response.data.gmtCreated) })
    if (isHospital(this.form.role)) {
      this.organisation = this.form.hospital
    }
    if (isSupplier(this.form.role)) {
      this.organisation = this.form.supplier
    }
    this.isLoading = false
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onGoBack() {
      this.$router.back()
    },
    onClickViewRequiredMaterials() {
      this.$router.push(`/required-materials/index?userId=${this.id}`)
    },
    onClickViewSuppliedMaterials() {
      this.$router.push(`/supplied-materials/index?userId=${this.id}`)
    },
    async onClickVerify() {
      const response = await verify(this.form.id)
      this.form.status = 'VERIFIED'
      this.$message.info(response.message)
    }
  }
}
</script>

<style scoped>
  .line{
    text-align: center;
  }

  .buttons-bottom {
    margin-bottom: 2rem;
  }
</style>

