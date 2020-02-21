<template>
  <div class="app-container">
    <el-table
      class="list-section"
      v-loading="listLoading"
      :data="messages"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="手机号码" width="200">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="反馈信息" width="750">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提交日期" width="240">
        <template slot-scope="scope">
          {{ scope.row.formattedGmtCreated }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :current-page.sync="pagination.page"
      @current-change="loadCurrent"
      @prev-click="loadPrev"
      @next-click="loadNext"></el-pagination>
  </div>
</template>

<script>
import { list } from '@/api/contact-message'
import { parseTime } from '@/utils/'

export default {

  data() {
    return {
      messages: [],
      listLoading: true,
      pagination: {
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  async created() {
    await this.fetchContactMessages()
    this.listLoading = false
  },
  methods: {
    async fetchContactMessages() {
      const response = await list(this.pagination.page, this.pagination.size)
      this.pagination.total = response.total
      this.messages = response.data
        .map(message => Object.assign(message, { formattedGmtCreated: parseTime(message.gmtCreated) }))
    },
    async loadCurrent() {
      this.listLoading = true
      await this.fetchContactMessages()
      this.listLoading = false
    },
    async loadPrev() {
      this.listLoading = true
      --this.page
      await this.fetchContactMessages()
      this.listLoading = false
    },
    async loadNext() {
      this.listLoading = true
      ++this.page
      await this.fetchContactMessages()
      this.listLoading = false
    }
  }
}
</script>
<style>
  .list-section {
    margin-bottom: 2rem;
  }
</style>
