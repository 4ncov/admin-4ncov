<template>
  <div class="app-container">
    <div class="list-section">
      <el-row>
        <el-col :span="4">
          <el-input placeholder="请输入手机号" v-model="filter.telephone" />
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="4">
          <el-select class="select" placeholder="请选择用户类型" v-model="filter.role">
            <el-option
              v-for="role in Object.keys(userRoles)"
              :key="role"
              :label="userRoles[role].description"
              :value="role"
            />
          </el-select>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="4">
          <el-select class="select" placeholder="请选择状态" v-model="filter.status">
            <el-option
              v-for="sName in Object.keys(userStatus)"
              :key="sName"
              :label="userStatus[sName].description"
              :value="sName"
            />
          </el-select>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="9">
          <el-button type="success" icon="el-icon-search" @click="onClickSearch">搜索</el-button>
          <el-button type="info" icon="el-icon-delete" @click="onClickClearSearch">清空搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      class="list-section"
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
      @current-change="fetchUsers"
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
      userStatus: USER_STATUS,
      filter: {
        status: '',
        telephone: '',
        role: ''
      }
    }
  },
  async created() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.listLoading = true
      const response = await list(this.page, this.size, this.filter)
      this.users = response.data.map(u => Object.assign(u, { formattedGmtCreated: parseTime(u.gmtCreated) }))
      this.total = response.total
      this.listLoading = false
    },
    async loadPrev() {
      --this.page
      await this.fetchUsers()
    },
    async loadNext() {
      ++this.page
      await this.fetchUsers()
    },
    onClickView(user) {
      this.$router.push(`/users/${user.id}`)
    },
    async onClickSearch() {
      this.page = 1
      await this.fetchUsers()
    },
    async onClickClearSearch() {
      this.filter = {}
      this.page = 1
      await this.fetchUsers()
    }
  }
}
</script>
<style>
  .list-section {
    margin-bottom: 2rem;
  }

  .select {
    width: 100%;
  }
</style>
