<template>
  <div class="app-container">
    <div class="list-section">
      <el-row>
        <el-col :span="4">
          <el-select placeholder="请选择物资类别" v-model="filter.category">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.name"
            />
          </el-select>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="4">
          <el-select placeholder="请选择状态" v-model="filter.status">
            <el-option
              v-for="sName in Object.keys(status)"
              :key="sName"
              :label="status[sName].description"
              :value="sName"
            />
          </el-select>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="4">
          <el-input placeholder="请输入发布手机号" v-model="filter.contactPhone" />
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="9">
          <el-button type="success" icon="el-icon-search" @click="onClickSearch">搜索</el-button>
          <el-button type="info" icon="el-icon-delete" @click="onClickClearSearch">清空搜索</el-button>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onClickNew">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      class="list-section"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="() => onClickEdit(scope.row)"></i>
          <i class="el-icon-delete"></i>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.material.name }}
        </template>
      </el-table-column>
      <el-table-column label="类别" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.material.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行标准" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.material.standard }}
        </template>
      </el-table-column>
      <el-table-column label="数量" width="90" align="center">
        <template slot-scope="scope">
          {{ scope.row.material.quantity }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="statusFilter(scope.row.status).type">{{ statusFilter(scope.row.status).description }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="机构名称" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.organisationName }}
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.contactorPhone }} {{ scope.row.contactorName }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="发布时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.formattedGmtCreated }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page.sync="page"
      @current-change="loadCurrent"
      @prev-click="loadPrev"
      @next-click="loadNext"></el-pagination>
  </div>
</template>

<script>
import { list as listCategories } from '@/api/material-category'
import { list as listMaterials } from '@/api/required-materials'
import { parseTime } from '@/utils/'
import STATUS from '@/utils/status'

export default {
  name: 'RequiredMaterials',
  data() {
    return {
      list: null,
      listLoading: true,
      page: 1,
      size: 10,
      total: 0,
      filter: {
        category: '',
        status: '',
        contactPhone: '',
        userId: this.$route.query.userId
      },
      status: STATUS,
      categories: []
    }
  },
  async created() {
    this.listLoading = true
    await this.fetchCategories()
    await this.fetchMaterials()
    this.listLoading = false
  },
  methods: {
    async fetchMaterials() {
      const response = await listMaterials(this.page, this.size, this.filter)
      this.list = response.data
        .map(material => Object.assign(material, { formattedGmtCreated: parseTime(material.gmtCreated) }))
      this.total = response.total
    },
    async fetchCategories() {
      const response = await listCategories()
      this.categories = response.data
    },
    async loadPrev() {
      this.listLoading = true
      --this.page
      await this.fetchMaterials()
      this.listLoading = false
    },
    async loadNext() {
      this.listLoading = true
      ++this.page
      await this.fetchMaterials()
      this.listLoading = false
    },
    async loadCurrent() {
      this.listLoading = true
      await this.fetchMaterials()
      this.listLoading = false
    },
    statusFilter(status) {
      return STATUS[status]
    },
    async onClickNew() {
      await this.$store.dispatch('material/restore')
      this.$router.push('/required-materials/new')
    },
    async onClickEdit(m) {
      const requiredMaterial = Object.assign(m, { materials: [m.material] })
      await this.$store.dispatch('material/loadRequiredMaterial', requiredMaterial)
      this.$router.push(`/required-materials/${m.id}`)
    },
    async onClickSearch() {
      if (this.isFilterEmpty(this.filter)) {
        console.log('No filter provided, not refreshing')
        return
      }
      this.listLoading = true
      this.page = 1
      await this.fetchMaterials()
      this.listLoading = false
    },
    async onClickClearSearch() {
      this.listLoading = true
      this.page = 1
      this.filter = {}
      await this.fetchMaterials()
      this.listLoading = false
    },
    isFilterEmpty(filter) {
      return !filter.category && !filter.status && !filter.contactPhone
    }
  }
}
</script>
<style>
  el-select {
    width: 100%;
  }

  .list-section {
    margin-bottom: 2rem;
  }
</style>
