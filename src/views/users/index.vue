<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="users"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="操作" width="90">
        <template slot-scope="scope">
          <i class="el-icon-view" @click="() => onClickView(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="300">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话" width="200">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="100">
        <template slot-scope="scope">
          {{ userRoles[scope.row.role].description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="userStatus[scope.row.status].type">{{ userStatus[scope.row.status].description }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" width="200">
        <template slot-scope="scope">
          {{ scope.row.formattedGmtCreated }}
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
import { list } from '@/api/user'
import USER_ROLE from '@/utils/user-role'
import { USER_STATUS } from '@/utils/status'
import { parseTime } from '@/utils/'

export default {
  data() {
    return {
      users: [],
      listLoading: true,
      page: 1,
      size: 10,
      total: 0,
      userRoles: USER_ROLE,
      userStatus: USER_STATUS
    }
  },
  async created() {
    await this.fetchMaterials()
  },
  methods: {
    async fetchMaterials() {
      this.listLoading = true
      const response = await list(this.page, this.size)
      this.users = response.data.map(u => Object.assign(u, { formattedGmtCreated: parseTime(u.gmtCreated) }))
      this.total = response.total
      this.listLoading = false
    },
    async loadPrev() {
      --this.page
      await this.fetchMaterials()
    },
    async loadNext() {
      ++this.page
      await this.fetchMaterials()
    },
    onClickView(user) {
      this.$router.push(`/users/${user.id}`)
    }
  }
}
</script>
