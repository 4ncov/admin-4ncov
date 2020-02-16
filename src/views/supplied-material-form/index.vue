<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <div>
        <el-col :span="24">
          <el-form-item>
            <el-button type="warning" @click="onGoBack"><i class="el-icon-back"></i> 返回</el-button>
            <el-button type="success"><i class="el-icon-check"></i> 保存</el-button>
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
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.comment" />
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
          <el-form-item v-if="material.imageUrl">
            <el-image lazy :src="material.imageUrl"></el-image>
          </el-form-item>
        </el-col>
        <el-col :span="13">&nbsp;</el-col>
      </div>
      <div> <!-- TODO hide button in edit mode -->
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
            <el-button type="warning" @click="onGoBack"><i class="el-icon-back"></i> 返回</el-button>
            <el-button type="success"><i class="el-icon-check"></i> 保存</el-button>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>
import { list } from '@/api/material-category'

export default {
  data() {
    return {
      form: Object.assign({
        materials: [{
          name: '',
          quantity: null,
          standard: '',
          category: '',
          imageUrl: ''
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
        organisationName: ''
      }, this.$store.getters.suppliedMaterial),
      categories: []
    }
  },
  async created() {
    const response = await list()
    this.categories = response.data
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
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
        imageUrl: ''
      })
    },
    onDeleteMaterial(i) {
      this.form.materials.splice(i, 1)
    },
    onGoBack() {
      this.$router.back()
    },
    onUploadSuccess(res, material) {
      material.imageUrl = res.data.url
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

