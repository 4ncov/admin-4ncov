<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <div>
        <el-col :span="24">
          <el-form-item>
            <el-button type="warning" icon="el-icon-back" @click="onGoBack">返回</el-button>
            <el-button type="success" icon="el-icon-check" @click="onSave">保存</el-button>
          </el-form-item>
        </el-col>
      </div>
      <div>
        <el-col :span="24">
          <el-form-item>
            <h2>收货信息</h2>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系人">
            <el-input v-model="form.contactorName" />
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="form.contactorPhone" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="组织机构名称">
            <el-input v-model="form.organisationName" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="省">
            <el-input v-model="form.address.province" />
          </el-form-item>
          <el-form-item label="市">
            <el-input v-model="form.address.city" />
          </el-form-item>
          <el-form-item label="区">
            <el-input v-model="form.address.district" />
          </el-form-item>
          <el-form-item label="街道地址">
            <el-input v-model="form.address.streetAddress" />
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item label="信息来源">
            <el-input v-model="form.source" />
          </el-form-item>
          <el-form-item label="发布为">
            <el-select v-model="form.publishFor" style="width: 100%;" placeholder="请选择为何发布">
              <el-option label="医院" value="医院"></el-option>
              <el-option label="组织" value="组织"></el-option>
              <el-option label="个人" value="个人"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.comment" />
          </el-form-item>
          <el-form-item label="状态" v-if="status[form.status]">
            <el-tag :type="status[form.status].type">
              {{ status[form.status].description }}
            </el-tag>
            <el-button
              style="margin-left: 10px;"
              type="primary"
              size="small"
              v-if="form.status === 'PENDING'"
              @click="onClickApprove"
            >批准并发布</el-button>
            <el-dialog title="确认批准并发布" :visible.sync="dialog.isApproveVisible" width="30%">
              <span>确定批准该寻求并发布吗？一旦发布，该寻求将公开可见。</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.isApproveVisible = false">取消</el-button>
                <el-button type="success" @click="onApprove">确认</el-button>
              </span>
            </el-dialog>
            <el-button
              type="warning"
              size="small"
              v-if="form.status === 'PENDING' && !form.reviewMessage"
              @click="onClickReject"
            >驳回审核</el-button>
            <el-dialog title="驳回审核" :visible.sync="dialog.isRejectVisible" width="30%">
              <span>确定驳回该寻求的审核吗？一旦驳回，发布者将需要修改其内容以满足审核意见，并需重新审核方可发布。</span>
              <el-input v-model="reviewMessage" placeholder="请填写审核意见"></el-input>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.isRejectVisible = false">取消</el-button>
                <el-button type="danger" @click="onReject">确认</el-button>
              </span>
            </el-dialog>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input disabled v-model="form.reviewMessage" />
          </el-form-item>
        </el-col>
      </div>
      <div>
        <el-col :span="24">
          <el-form-item>
            <h2>所需物资信息</h2>
          </el-form-item>
        </el-col>
      </div>
      <div v-for="(material, i) in form.materials" :key="i">
        <el-col :span="24">
          <el-form-item :label="`物资${i + 1}`">
            <el-button v-if="form.materials.length > 1" type="danger" @click="() => onDeleteMaterial(i)">
              <i class="el-icon-delete"></i> 删除物资
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="物资名称">
            <el-input v-model="material.name" placeholder="请输入物资名称(必填)" />
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item label="物资类别">
            <el-select v-model="material.category" style="width: 100%;" placeholder="请选择物资类别(必填)">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="物资数量">
            <el-input v-model="material.quantity" placeholder="请输入物资数量(必填)" />
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item label="执行标准">
            <el-input v-model="material.standard" placeholder="请输入执行标准(必填)" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="物资图片">
            <el-upload
              drag
              action="/api/images?category=寻求图片"
              name="image"
              style="width: 100%;"
              :on-success="(res) => onUploadSuccess(res, material)"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">拖拽或<em>点击</em>上传</div>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="material.imageUrls && material.imageUrls.length > 0">
            <el-image lazy v-for="url in material.imageUrls" :key="url" :src="url"></el-image>
          </el-form-item>
        </el-col>
        <el-col :span="13">&nbsp;</el-col>
      </div>
      <div v-if="!isEdit">
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="onAddMaterial">
              <i class="el-icon-circle-plus-outline"></i> 增加物资
            </el-button>
          </el-form-item>
        </el-col>
      </div>
      <div>
        <el-col :span="24" class="buttons-bottom">
          <el-form-item>
            <el-button type="warning" icon="el-icon-back" @click="onGoBack">返回</el-button>
            <el-button type="success" icon="el-icon-check" @click="onSave">保存</el-button>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>
import { list } from '@/api/material-category'
import { approve, reject, create } from '@/api/required-materials'
import STATUS from '@/utils/status'

export default {
  data() {
    return {
      id: this.$route.params['id'],
      form: Object.assign({
        materials: [{
          name: '',
          quantity: null,
          standard: '',
          category: '',
          imageUrls: []
        }],
        address: {
          province: '',
          city: '',
          district: '',
          streetAddress: ''
        },
        comment: '',
        contactorName: '',
        contactorPhone: '',
        organisationName: '',
        source: '',
        status: '',
        publishFor: '',
        reviewMessage: ''
      }, this.$store.getters.requiredMaterial),
      categories: [],
      status: STATUS,
      isEdit: true,
      dialog: {
        isApproveVisible: false,
        isRejectVisible: false
      },
      reviewMessage: ''
    }
  },
  async created() {
    this.isEdit = !!this.$route.params['id']
    if (this.isEdit && !this.$store.getters.requiredMaterial.id) {
      alert('请重新进入编辑.')
      this.$router.back()
    }
    const response = await list()
    this.categories = response.data
  },
  methods: {
    async onSave() {
      if (!this.isEdit) {
        const response = await create(this.form)
        this.$message({ message: response.message, type: 'info' })
      } else {
        console.log('update') // TODO update
      }
      this.$router.back()
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    onAddMaterial() {
      this.form.materials.push({
        name: '',
        quantity: null,
        standard: '',
        category: '',
        imageUrls: []
      })
    },
    onDeleteMaterial(i) {
      this.form.materials.splice(i, 1)
    },
    onGoBack() {
      this.$router.back()
    },
    onUploadSuccess(res, material) {
      material.imageUrls.push(res.data.url)
    },
    onClickApprove() {
      this.dialog.isApproveVisible = true
    },
    onClickReject() {
      this.reviewMessage = ''
      this.dialog.isRejectVisible = true
    },
    async onApprove() {
      const response = await approve(this.id)
      this.dialog.isApproveVisible = false
      this.$message.info(response.message)
      this.form.status = 'PUBLISHED'
      this.form.reviewMessage = ''
    },
    async onReject() {
      if (!this.reviewMessage) {
        this.$message.warning('请填写审核意见')
        return
      }
      const response = await reject(this.id, this.reviewMessage)
      this.dialog.isRejectVisible = false
      this.$message.info(response.message)
      this.form.reviewMessage = this.reviewMessage
    }
  }
}
</script>

<style scoped>
  .line {
    text-align: center;
  }

  .buttons-bottom {
    margin-bottom: 2rem;
  }
</style>

