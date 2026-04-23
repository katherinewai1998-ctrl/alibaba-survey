<template>
  <div class="admin-page">
    <div class="card">
      <h1 class="card-title">后台数据管理</h1>
      
      <div class="admin-controls">
        <div class="filter-group">
          <label class="filter-label">筛选条件：</label>
          <select v-model="filters.userType" class="filter-select">
            <option value="">所有用户类型</option>
            <option value="B 端用户">B 端用户</option>
            <option value="C 端用户">C 端用户</option>
            <option value="两者都是">两者都是</option>
          </select>
          
          <select v-model="filters.age" class="filter-select">
            <option value="">所有年龄段</option>
            <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}</option>
          </select>

          <select v-model="filters.occupation" class="filter-select">
            <option value="">所有职业</option>
            <option v-for="occ in occupationOptions" :key="occ" :value="occ">{{ occ }}</option>
          </select>

          <button @click="applyFilters" class="btn btn-primary" style="padding: 0.5rem 1rem;">应用筛选</button>
          <button @click="resetFilters" class="btn btn-secondary" style="padding: 0.5rem 1rem;">重置</button>
        </div>

        <div class="action-buttons">
          <button @click="exportToCSV" class="btn btn-primary">导出 CSV</button>
          <button @click="refreshData" class="btn btn-secondary">刷新数据</button>
        </div>
      </div>

      <div class="stats-overview" v-if="submissions.length > 0">
        <div class="stat-card">
          <div class="stat-value">{{ submissions.length }}</div>
          <div class="stat-label">总提交数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ bUserCount }}</div>
          <div class="stat-label">B 端用户</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ cUserCount }}</div>
          <div class="stat-label">C 端用户</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ todayCount }}</div>
          <div class="stat-label">今日提交</div>
        </div>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>提交时间</th>
              <th>年龄段</th>
              <th>性别</th>
              <th>职业</th>
              <th>职位</th>
              <th>用户类型</th>
              <th>使用的大模型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredSubmissions" :key="item.id">
              <td>{{ formatDate(item.submittedAt) }}</td>
              <td>{{ item.age }}</td>
              <td>{{ item.gender }}</td>
              <td>{{ truncate(item.occupation, 20) }}</td>
              <td>{{ truncate(item.position, 15) }}</td>
              <td>{{ truncate(item.userType, 15) }}</td>
              <td>
                <span class="tag" v-for="model in item.models?.slice(0, 2)" :key="model">
                  {{ model }}
                </span>
                <span v-if="item.models?.length > 2" class="tag-more">+{{ item.models.length - 2 }}</span>
              </td>
              <td>
                <button @click="viewDetails(item)" class="btn-view">查看详情</button>
                <button @click="deleteSubmission(item.id)" class="btn-delete">删除</button>
              </td>
            </tr>
            <tr v-if="filteredSubmissions.length === 0">
              <td colspan="8" style="text-align: center; padding: 3rem; color: #999;">
                暂无数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button @click="currentPage = 1" :disabled="currentPage === 1" class="btn-page">首页</button>
        <button @click="currentPage--" :disabled="currentPage === 1" class="btn-page">上一页</button>
        <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn-page">下一页</button>
        <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="btn-page">末页</button>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetail" class="modal-overlay" @click="closeDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>问卷详情</h2>
          <button @click="closeDetail" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedSubmission" class="detail-section">
            <h3>基础信息</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">提交时间:</span>
                <span class="detail-value">{{ formatDate(selectedSubmission.submittedAt, true) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">年龄段:</span>
                <span class="detail-value">{{ selectedSubmission.age }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">性别:</span>
                <span class="detail-value">{{ selectedSubmission.gender }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">职业:</span>
                <span class="detail-value">{{ selectedSubmission.occupation }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">职位:</span>
                <span class="detail-value">{{ selectedSubmission.position }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">用户类型:</span>
                <span class="detail-value">{{ selectedSubmission.userType }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>大模型使用情况</h3>
            <div class="detail-list">
              <span v-for="model in selectedSubmission?.models" :key="model" class="detail-tag">
                {{ model }}
              </span>
            </div>
          </div>

          <div v-if="selectedSubmission?.businessIdentities?.length" class="detail-section">
            <h3>业务身份</h3>
            <div class="detail-list">
              <span v-for="id in selectedSubmission.businessIdentities" :key="id" class="detail-tag">
                {{ id }}
              </span>
            </div>
          </div>

          <div v-if="selectedSubmission?.alibabaProducts?.length" class="detail-section">
            <h3>使用的阿里产品</h3>
            <div class="detail-list">
              <span v-for="prod in selectedSubmission.alibabaProducts" :key="prod" class="detail-tag">
                {{ prod }}
              </span>
            </div>
          </div>

          <div v-if="selectedSubmission?.cloudProviders?.length" class="detail-section">
            <h3>云服务厂商</h3>
            <div class="detail-list">
              <span v-for="provider in selectedSubmission.cloudProviders" :key="provider" class="detail-tag">
                {{ provider }}
              </span>
            </div>
          </div>

          <div v-if="selectedSubmission?.officeTools?.length" class="detail-section">
            <h3>协同办公工具</h3>
            <div class="detail-list">
              <span v-for="tool in selectedSubmission.officeTools" :key="tool" class="detail-tag">
                {{ tool }}
              </span>
            </div>
          </div>

          <div v-if="selectedSubmission?.llmModels?.length" class="detail-section">
            <h3>使用的大模型</h3>
            <div class="detail-list">
              <span v-for="model in selectedSubmission.llmModels" :key="model" class="detail-tag">
                {{ model }}
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeDetail" class="btn btn-secondary">关闭</button>
          <button @click="exportSingle(selectedSubmission)" class="btn btn-primary">导出此条</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      submissions: [],
      filteredSubmissions: [],
      currentPage: 1,
      pageSize: 20,
      showDetail: false,
      selectedSubmission: null,
      filters: {
        userType: '',
        age: '',
        occupation: ''
      },
      ageOptions: ['18 岁及以下', '19-25 岁', '26-35 岁', '36-45 岁', '46-55 岁', '56 岁及以上'],
      occupationOptions: [
        '企业职场人员（普通职员/基层/中层/高层管理者）',
        '金融行业从业者（银行、证券、保险、基金等）',
        '技术行业从业者（开发、测试、运维、算法等）',
        '企业家/企业主',
        '个体工商户/商家',
        '自由职业者',
        '学生',
        '公职人员',
        '服务业从业者（餐饮、物流、文旅等）',
        '教育行业从业者（教师、教研等）',
        '医疗行业从业者（医生、护士等）'
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredSubmissions.length / this.pageSize)
    },
    paginatedSubmissions() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredSubmissions.slice(start, end)
    },
    bUserCount() {
      return this.submissions.filter(s => 
        s.userType?.includes('B 端') || s.userType === '两者都是'
      ).length
    },
    cUserCount() {
      return this.submissions.filter(s => 
        s.userType?.includes('C 端') || s.userType === '两者都是'
      ).length
    },
    todayCount() {
      const today = new Date().toDateString()
      return this.submissions.filter(s => 
        new Date(s.submittedAt).toDateString() === today
      ).length
    }
  },
  mounted() {
    this.loadData()
    // 每 30 秒自动刷新
    this.refreshInterval = setInterval(this.loadData, 30000)
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    async loadData() {
      try {
        const response = await fetch('/api/submissions')
        if (response.ok) {
          this.submissions = await response.json()
          this.applyFilters()
        }
      } catch (error) {
        console.error('加载数据失败:', error)
      }
    },
    applyFilters() {
      this.filteredSubmissions = this.submissions.filter(item => {
        if (this.filters.userType && !item.userType?.includes(this.filters.userType)) {
          return false
        }
        if (this.filters.age && item.age !== this.filters.age) {
          return false
        }
        if (this.filters.occupation && item.occupation !== this.filters.occupation) {
          return false
        }
        return true
      })
      this.currentPage = 1
    },
    resetFilters() {
      this.filters = {
        userType: '',
        age: '',
        occupation: ''
      }
      this.applyFilters()
    },
    refreshData() {
      this.loadData()
    },
    formatDate(dateStr, full = false) {
      const date = new Date(dateStr)
      if (full) {
        return date.toLocaleString('zh-CN', { 
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }
      return date.toLocaleDateString('zh-CN', { 
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    truncate(str, len) {
      if (!str) return ''
      return str.length > len ? str.substring(0, len) + '...' : str
    },
    viewDetails(item) {
      this.selectedSubmission = item
      this.showDetail = true
    },
    closeDetail() {
      this.showDetail = false
      this.selectedSubmission = null
    },
    async deleteSubmission(id) {
      if (!confirm('确定要删除这条提交记录吗？')) return
      
      try {
        const response = await fetch(`/api/submissions/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          this.loadData()
        } else {
          alert('删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败，请重试')
      }
    },
    exportToCSV() {
      const headers = ['提交时间', '年龄段', '性别', '职业', '职位', '用户类型', '大模型']
      const rows = this.filteredSubmissions.map(item => [
        this.formatDate(item.submittedAt, true),
        item.age,
        item.gender,
        item.occupation,
        item.position,
        item.userType,
        (item.models || []).join('; ')
      ])
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
      ].join('\n')
      
      this.downloadFile(csvContent, '问卷数据.csv', 'text/csv;charset=utf-8;')
    },
    exportSingle(item) {
      const headers = ['字段', '值']
      const rows = []
      
      Object.entries(item).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          rows.push([
            key,
            Array.isArray(value) ? value.join('; ') : String(value)
          ])
        }
      })
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
      ].join('\n')
      
      this.downloadFile(csvContent, `问卷详情_${this.formatDate(item.submittedAt)}.csv`, 'text/csv;charset=utf-8;')
    },
    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
.admin-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 600;
  color: #555;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.data-table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.tag {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-right: 0.3rem;
  margin-bottom: 0.3rem;
}

.tag-more {
  display: inline-block;
  background: #f5f5f5;
  color: #666;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.btn-view,
.btn-delete {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.3rem;
  font-size: 0.85rem;
}

.btn-view {
  background: #4caf50;
  color: white;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.btn-page {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-page:hover:not(:disabled) {
  border-color: #ff6a00;
  color: #ff6a00;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  padding: 0 1rem;
  color: #666;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #e0e0e0;
}

.modal-header h2 {
  color: #333;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  color: #ff6a00;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.detail-label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.detail-value {
  color: #333;
  font-size: 1rem;
}

.detail-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-tag {
  display: inline-block;
  background: #fff3e0;
  color: #e65100;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 2px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
