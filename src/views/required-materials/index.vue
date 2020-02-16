<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="onClickNew"><i class="el-icon-circle-plus-outline"></i> 新增</el-button>
    </div>
    <el-table
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
      @current-change="fetchData"
      @prev-click="loadPrev"
      @next-click="loadNext"></el-pagination>
  </div>
</template>

<script>
import { list } from '@/api/required-materials'
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
      total: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      list(this.page, this.size).then(response => {
        this.list = response.data
          .map(material => Object.assign(material, { formattedGmtCreated: parseTime(material.gmtCreated) }))
        this.total = response.total
        this.listLoading = false
      })
    },
    loadPrev() {
      --this.page
      this.fetchData()
    },
    loadNext() {
      ++this.page
      this.fetchData()
    },
    statusFilter(status) {
      return STATUS[status]
    },
    onClickNew() {
      this.$router.push('/required-materials/new')
    },
    async onClickEdit(m) {
      const requiredMaterial = Object.assign(m, { materials: [m.material] })
      await this.$store.dispatch('material/loadRequiredMaterial', requiredMaterial)
      this.$router.push(`/required-materials/${m.id}`)
    }
  }
}
</script>
