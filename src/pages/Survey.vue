<template>
  <div class="survey-page">
    <div class="card">
      <h1 class="card-title">阿里巴巴相关业务调研问卷</h1>
      <p class="survey-intro">
        尊敬的用户：您好！本次问卷旨在调研您对阿里巴巴集团核心产品的使用体验、满意度及需求痛点，
        同时了解您对各产品对应竞争对手的认知与选择倾向。本问卷实行匿名制，所有数据仅用于产品优化和业务布局参考，
        全程预计 10-15 分钟，请您根据实际情况如实填写，感谢您的支持与配合！
      </p>

      <div v-if="!submitted" class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <p v-if="!submitted" class="progress-text">完成进度：{{ progressPercentage }}%</p>

      <form @submit.prevent="submitSurvey">
        <!-- 第一部分：调研者基础信息 -->
        <div v-if="currentSection >= 1" class="section">
          <h2 class="card-subtitle">一、调研者基础信息（必答）</h2>
          
          <div class="form-group">
            <label class="form-label required">1. 您的年龄段是？</label>
            <div class="radio-group">
              <label v-for="option in ageOptions" :key="option" class="radio-option">
                <input type="radio" v-model="formData.age" :value="option" required>
                {{ option }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">2. 您的性别是？</label>
            <div class="radio-group">
              <label v-for="option in genderOptions" :key="option" class="radio-option">
                <input type="radio" v-model="formData.gender" :value="option" required>
                {{ option }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">3. 您的职业类型是？</label>
            <div class="radio-group">
              <label v-for="option in occupationOptions" :key="option" class="radio-option">
                <input type="radio" v-model="formData.occupation" :value="option" required>
                {{ option }}
              </label>
              <label class="radio-option" v-if="formData.occupation === '其他'">
                <input type="text" v-model="formData.occupationOther" class="text-input" placeholder="请补充" style="margin-left: 26px; width: calc(100% - 26px);">
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">4. 您的职位是？</label>
            <div class="radio-group">
              <label v-for="option in positionOptions" :key="option" class="radio-option">
                <input type="radio" v-model="formData.position" :value="option" required>
                {{ option }}
              </label>
              <label class="radio-option" v-if="formData.position === '其他'">
                <input type="text" v-model="formData.positionOther" class="text-input" placeholder="请补充" style="margin-left: 26px; width: calc(100% - 26px);">
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">5. 您是否使用过以下大模型产品？（可多选）</label>
            <div class="checkbox-group">
              <label v-for="model in modelOptions" :key="model.label" class="checkbox-option">
                <input type="checkbox" v-model="formData.models" :value="model.label">
                {{ model.label }}
              </label>
              <label class="checkbox-option" v-if="formData.models.includes('其他')">
                <input type="text" v-model="formData.modelsOther" class="text-input" placeholder="请补充" style="margin-left: 26px; width: calc(100% - 26px);">
              </label>
            </div>
          </div>
        </div>

        <hr class="section-divider" v-if="currentSection >= 1">

        <!-- 第二部分：用户身份筛选 -->
        <div v-if="currentSection >= 2" class="section">
          <h2 class="card-subtitle">二、用户身份筛选（必答）</h2>
          
          <div class="form-group">
            <label class="form-label required">1. 您的用户类型是？</label>
            <div class="radio-group">
              <label v-for="option in userTypeOptions" :key="option" class="radio-option">
                <input type="radio" v-model="formData.userType" :value="option" required>
                {{ option }}
              </label>
            </div>
          </div>

          <div v-if="isBUser" class="form-group">
            <label class="form-label">2. 请选择您的具体业务身份（可多选）</label>
            <div class="checkbox-group">
              <label v-for="option in businessIdentityOptions" :key="option" class="checkbox-option">
                <input type="checkbox" v-model="formData.businessIdentities" :value="option">
                {{ option }}
              </label>
              <label class="checkbox-option" v-if="formData.businessIdentities.includes('其他')">
                <input type="text" v-model="formData.businessIdentityOther" class="text-input" placeholder="请补充" style="margin-left: 26px; width: calc(100% - 26px);">
              </label>
            </div>
          </div>

          <div v-if="isCUser" class="form-group">
            <label class="form-label">3. 您使用的阿里巴巴相关产品（可多选）</label>
            <div class="checkbox-group">
              <label v-for="product in alibabaProducts" :key="product" class="checkbox-option">
                <input type="checkbox" v-model="formData.alibabaProducts" :value="product">
                {{ product }}
              </label>
            </div>
          </div>
        </div>

        <hr class="section-divider" v-if="currentSection >= 2 && isBUser">

        <!-- 第三部分：B 端用户调研模块 -->
        <div v-if="currentSection >= 3 && isBUser" class="section">
          <h2 class="card-subtitle">三、B 端用户调研模块</h2>
          
          <!-- 淘天商家专项 -->
          <div class="subsection">
            <h3 class="card-subtitle" style="font-size: 1.2rem;">（一）淘天商家专项调研</h3>
            
            <div class="form-group">
              <label class="form-label">1. 您是否使用淘宝/天猫开设店铺？</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" v-model="formData.taobaoSeller" value="是">
                  是（继续作答本专项）
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="formData.taobaoSeller" value="否">
                  否（跳过本专项）
                </label>
              </div>
            </div>

            <div v-if="formData.taobaoSeller === '是'">
              <div class="form-group">
                <label class="form-label">2. 您的店铺开店时长？</label>
                <div class="radio-group">
                  <label v-for="option in storeAgeOptions" :key="option" class="radio-option">
                    <input type="radio" v-model="formData.storeAge" :value="option">
                    {{ option }}
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">3. 您的店铺类型是？</label>
                <div class="radio-group">
                  <label v-for="option in storeTypeOptions" :key="option" class="radio-option">
                    <input type="radio" v-model="formData.storeType" :value="option">
                    {{ option }}
                  </label>
                  <label class="radio-option" v-if="formData.storeType === '其他'">
                    <input type="text" v-model="formData.storeTypeOther" class="text-input" placeholder="请补充" style="margin-left: 26px; width: calc(100% - 26px);">
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">4. 您的店铺主营品类是？（可多选）</label>
                <div class="checkbox-group">
                  <label v-for="option in categoryOptions" :key="option" class="checkbox-option">
                    <input type="checkbox" v-model="formData.categories" :value="option">
                    {{ option }}
                  </label>
                  <label class="checkbox-option" v-if="formData.categories.includes('其他')">
                    <input type="text" v-model="formData.categoriesOther" class="text-input" placeholder="请补充" style="margin-left: 26px; width: calc(100% - 26px);">
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 阿里云用户专项 -->
          <div class="subsection">
            <h3 class="card-subtitle" style="font-size: 1.2rem;">（二）阿里云用户专项调研</h3>
            
            <div class="form-group">
              <label class="form-label">1. 您是否使用过任何云服务厂商的服务？</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" v-model="formData.cloudUser" value="是">
                  是（继续作答本专项）
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="formData.cloudUser" value="否">
                  否（跳过本专项）
                </label>
              </div>
            </div>

            <div v-if="formData.cloudUser === '是'">
              <div class="form-group">
                <label class="form-label">2. 目前您正在使用的云服务厂商有哪些？（可多选）</label>
                <div class="checkbox-group">
                  <label v-for="provider in cloudProviders" :key="provider" class="checkbox-option">
                    <input type="checkbox" v-model="formData.cloudProviders" :value="provider">
                    {{ provider }}
                  </label>
                </div>
              </div>

              <div v-if="formData.cloudProviders.includes('中国：阿里云')" class="form-group">
                <label class="form-label">3. 您使用阿里云的主要业务场景是？（可多选）</label>
                <div class="checkbox-group">
                  <label v-for="scenario in cloudScenarios" :key="scenario" class="checkbox-option">
                    <input type="checkbox" v-model="formData.cloudScenarios" :value="scenario">
                    {{ scenario }}
                  </label>
                </div>
              </div>

              <div v-if="formData.cloudProviders.includes('中国：阿里云')" class="form-group">
                <label class="form-label">4. 您使用阿里云的时长？</label>
                <div class="radio-group">
                  <label v-for="option in usageDurationOptions" :key="option" class="radio-option">
                    <input type="radio" v-model="formData.aliyunDuration" :value="option">
                    {{ option }}
                  </label>
                </div>
              </div>

              <div v-if="formData.cloudProviders.includes('中国：阿里云')" class="form-group">
                <label class="form-label">5. 您使用阿里云的付费模式是？</label>
                <div class="radio-group">
                  <label v-for="option in paymentModelOptions" :key="option" class="radio-option">
                    <input type="radio" v-model="formData.aliyunPayment" :value="option">
                    {{ option }}
                  </label>
                  <label class="radio-option" v-if="formData.aliyunPayment === '其他'">
                    <input type="text" v-model="formData.aliyunPaymentOther" class="text-input" placeholder="请补充" style="margin-left: 26px; width: calc(100% - 26px);">
                  </label>
                </div>
              </div>

              <div v-if="formData.cloudProviders.includes('中国：阿里云')" class="form-group">
                <label class="form-label">6. 您每月在阿里云上的投入金额大概是？</label>
                <div class="radio-group">
                  <label v-for="option in spendingOptions" :key="option" class="radio-option">
                    <input type="radio" v-model="formData.aliyunSpending" :value="option">
                    {{ option }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 钉钉用户专项 -->
          <div class="subsection">
            <h3 class="card-subtitle" style="font-size: 1.2rem;">（三）钉钉用户专项调研</h3>
            
            <div class="form-group">
              <label class="form-label">1. 您是否使用过任何协同办公工具？</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" v-model="formData.officeToolUser" value="是">
                  是（继续作答本专项）
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="formData.officeToolUser" value="否">
                  否（跳过本专项）
                </label>
              </div>
            </div>

            <div v-if="formData.officeToolUser === '是'">
              <div class="form-group">
                <label class="form-label">2. 目前您正在使用的协同办公工具有哪些？（可多选）</label>
                <div class="checkbox-group">
                  <label v-for="tool in officeTools" :key="tool" class="checkbox-option">
                    <input type="checkbox" v-model="formData.officeTools" :value="tool">
                    {{ tool }}
                  </label>
                </div>
              </div>

              <div v-if="formData.officeTools.includes('钉钉')" class="form-group">
                <label class="form-label">3. 您所在企业的规模是？</label>
                <div class="radio-group">
                  <label v-for="option in companySizeOptions" :key="option" class="radio-option">
                    <input type="radio" v-model="formData.companySize" :value="option">
                    {{ option }}
                  </label>
                </div>
              </div>

              <div v-if="formData.officeTools.includes('钉钉')" class="form-group">
                <label class="form-label">4. 您使用钉钉的核心场景是？（可多选）</label>
                <div class="checkbox-group">
                  <label v-for="scenario in dingtalkScenarios" :key="scenario" class="checkbox-option">
                    <input type="checkbox" v-model="formData.dingtalkScenarios" :value="scenario">
                    {{ scenario }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 千问模型应用者专项 -->
          <div class="subsection">
            <h3 class="card-subtitle" style="font-size: 1.2rem;">（四）千问模型应用者专项调研</h3>
            
            <div class="form-group">
              <label class="form-label">1. 您是否使用过任何底层大模型？</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" v-model="formData.llmUser" value="是">
                  是（继续作答本专项）
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="formData.llmUser" value="否">
                  否（跳过本专项）
                </label>
              </div>
            </div>

            <div v-if="formData.llmUser === '是'">
              <div class="form-group">
                <label class="form-label">2. 目前您正在使用的底层大模型有哪些？（可多选）</label>
                <div class="checkbox-group">
                  <label v-for="model in llmModels" :key="model" class="checkbox-option">
                    <input type="checkbox" v-model="formData.llmModels" :value="model">
                    {{ model }}
                  </label>
                </div>
              </div>

              <div v-if="formData.llmModels.includes('国内模型：千问（Qwen，阿里）')" class="form-group">
                <label class="form-label">3. 您使用千问模型的业务场景是？（可多选）</label>
                <div class="checkbox-group">
                  <label v-for="scenario in llmScenarios" :key="scenario" class="checkbox-option">
                    <input type="checkbox" v-model="formData.llmScenarios" :value="scenario">
                    {{ scenario }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions" style="margin-top: 2rem; display: flex; justify-content: space-between;">
          <button type="button" class="btn btn-secondary" @click="prevSection" v-if="currentSection > 1">
            上一页
          </button>
          <button type="button" class="btn btn-primary" @click="nextSection" v-if="currentSection < maxSection">
            下一页
          </button>
          <button type="submit" class="btn btn-primary" v-if="currentSection === maxSection">
            提交问卷
          </button>
        </div>
      </form>
    </div>

    <div v-if="submitted" class="card success-card">
      <div class="alert alert-success">
        <h2 style="margin-bottom: 1rem;">✅ 提交成功！</h2>
        <p>感谢您的参与，您的反馈对我们非常重要！</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Survey',
  data() {
    return {
      currentSection: 1,
      maxSection: 3,
      submitted: false,
      formData: {
        // 第一部分
        age: '',
        gender: '',
        occupation: '',
        occupationOther: '',
        position: '',
        positionOther: '',
        models: [],
        modelsOther: '',
        // 第二部分
        userType: '',
        businessIdentities: [],
        businessIdentityOther: '',
        alibabaProducts: [],
        // 第三部分 - 淘天商家
        taobaoSeller: '',
        storeAge: '',
        storeType: '',
        storeTypeOther: '',
        categories: [],
        categoriesOther: '',
        // 第三部分 - 阿里云
        cloudUser: '',
        cloudProviders: [],
        cloudScenarios: [],
        aliyunDuration: '',
        aliyunPayment: '',
        aliyunPaymentOther: '',
        aliyunSpending: '',
        // 第三部分 - 钉钉
        officeToolUser: '',
        officeTools: [],
        companySize: '',
        dingtalkScenarios: [],
        // 第三部分 - 千问
        llmUser: '',
        llmModels: [],
        llmScenarios: []
      },
      // 选项数据
      ageOptions: ['18 岁及以下', '19-25 岁', '26-35 岁', '36-45 岁', '46-55 岁', '56 岁及以上'],
      genderOptions: ['男', '女', '其他'],
      occupationOptions: ['企业职场人员（普通职员/基层/中层/高层管理者）', '金融行业从业者（银行、证券、保险、基金等）', '技术行业从业者（开发、测试、运维、算法等）', '企业家/企业主', '个体工商户/商家', '自由职业者', '学生', '公职人员', '服务业从业者（餐饮、物流、文旅等）', '教育行业从业者（教师、教研等）', '医疗行业从业者（医生、护士等）', '其他'],
      positionOptions: ['普通员工', '基层管理者', '中层管理者', '高层管理者', '创业者/企业主', '学生（无职位）', '其他'],
      modelOptions: [
        { label: '中国：千问（Qwen，阿里）' },
        { label: '中国：GLM' },
        { label: '中国：Kimi' },
        { label: '中国：百度文心一言' },
        { label: '中国：字节跳动火山大模型' },
        { label: '中国：腾讯混元大模型' },
        { label: '美国：ChatGPT（含 GPT-4）' },
        { label: '美国：Claude' },
        { label: '美国：Gemini' },
        { label: '未使用过以上任何一种' },
        { label: '其他' }
      ],
      userTypeOptions: ['B 端用户（企业/商家/机构，用于经营、办公等商业用途）', 'C 端用户（个人用户，用于消费、日常使用等非商业用途）', '两者都是', '均不是'],
      businessIdentityOptions: ['网店商家（含淘天、京东、拼多多、抖音电商等平台开店商家）', '云服务使用者（含阿里云、华为云、腾讯云、字节火山云、亚马逊云、微软云、谷歌云等）', '网上办公用户（含钉钉、飞书、企业微信等协同办公工具使用者）', '大模型应用者（含中国：千问、GLM、Kimi、文心一言、火山大模型、混元大模型；美国：ChatGPT、Claude、Gemini 等）', '其他'],
      alibabaProducts: ['淘宝/天猫（消费者）', '淘宝/天猫外卖（消费者）', '千问 APP（个人使用，原 Qwen APP）', '支付宝（含支付、理财、生活服务等）', '飞猪（旅游、出行、酒店预订）', '优酷（视频观看）', '高德地图（导航、出行服务）', '盒马鲜生（线上 + 线下购物）', '菜鸟裹裹（快递查询、寄件）', '阿里健康（医疗咨询、药品购买）', '未使用任何阿里巴巴相关产品'],
      storeAgeOptions: ['不足 6 个月', '6 个月 -1 年', '1-3 年', '3-5 年', '5 年以上'],
      storeTypeOptions: ['淘宝个人店', '淘宝企业店', '天猫旗舰店', '天猫专卖店', '天猫专营店', '其他'],
      categoryOptions: ['服饰美妆（服装、鞋帽、化妆品等）', '家电数码（手机、电脑、家电等）', '食品生鲜（零食、粮油、生鲜果蔬等）', '家居建材（家具、家电、装修材料等）', '母婴用品（奶粉、玩具、童装等）', '图书文具（书籍、文具、办公用品等）', '运动户外（运动装备、户外用品等）', '其他'],
      cloudProviders: ['中国：阿里云', '中国：腾讯云', '中国：华为云', '中国：字节跳动火山云', '美国：亚马逊云（AWS）', '美国：微软云（Azure）', '美国：谷歌云（Google Cloud）'],
      cloudScenarios: ['服务器租赁（云服务器、虚拟主机等）', '云存储（数据备份、文件存储等）', '云计算（算力支持、分布式计算等）', '安全服务（数据加密、漏洞防护等）', '大数据分析（数据处理、可视化等）', '人工智能服务（模型训练、推理等）', '网站/应用部署', '政企解决方案落地', '云数据库服务'],
      usageDurationOptions: ['不足 3 个月', '3 个月 -1 年', '1-3 年', '3 年以上'],
      paymentModelOptions: ['按需付费', '包年包月', '定制化付费', '其他'],
      spendingOptions: ['1000 元以下', '1000-5000 元', '5000-10000 元', '10000-50000 元', '50000 元以上'],
      officeTools: ['钉钉', '企业微信', '飞书', '石墨文档', '腾讯文档', '金山文档'],
      companySizeOptions: ['小型企业（1-50 人）', '中型企业（51-200 人）', '大型企业（201-1000 人）', '集团企业（1000 人以上）'],
      dingtalkScenarios: ['考勤管理（打卡、请假、排班等）', '团队沟通（即时消息、群聊等）', '流程审批（请假、报销、采购等）', '文档协作（共同编辑、分享等）', '客户管理（客户信息、跟进记录等）', '会议协同（线上会议、会议纪要等）', '任务管理（任务分配、进度跟踪等）', '薪酬管理（工资核算、发放记录等）', '供应链协同（与供应商、合作伙伴对接）', '企业培训（线上课程、考试等）'],
      llmModels: ['国内模型：千问（Qwen，阿里）', '国内模型：GLM', '国内模型：Kimi', '国内模型：百度文心一言', '国内模型：字节跳动火山大模型', '国内模型：腾讯混元大模型', '海外模型：ChatGPT（含 GPT-4）', '海外模型：Claude', '海外模型：Gemini'],
      llmScenarios: ['企业智能客服（客户咨询、问题解答等）', '内容生成（文案、海报、报告、代码等）', '数据分析与处理（数据整理、趋势分析等）', '产品研发辅助（需求分析、原型设计等）', '员工培训（知识库搭建、答疑等）', '智能翻译', '舆情分析', '代码开发与调试']
    }
  },
  computed: {
    isBUser() {
      return this.formData.userType === 'B 端用户（企业/商家/机构，用于经营、办公等商业用途）' || 
             this.formData.userType === '两者都是'
    },
    isCUser() {
      return this.formData.userType === 'C 端用户（个人用户，用于消费、日常使用等非商业用途）' || 
             this.formData.userType === '两者都是'
    },
    progressPercentage() {
      return Math.round((this.currentSection / this.maxSection) * 100)
    }
  },
  methods: {
    nextSection() {
      if (this.currentSection < this.maxSection) {
        this.currentSection++
        window.scrollTo(0, 0)
      }
    },
    prevSection() {
      if (this.currentSection > 1) {
        this.currentSection--
        window.scrollTo(0, 0)
      }
    },
    async submitSurvey() {
      try {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...this.formData,
            submittedAt: new Date().toISOString()
          })
        })

        if (response.ok) {
          this.submitted = true
          window.scrollTo(0, 0)
        } else {
          alert('提交失败，请重试')
        }
      } catch (error) {
        console.error('提交错误:', error)
        alert('提交失败，请检查网络连接')
      }
    }
  }
}
</script>

<style scoped>
.survey-page {
  max-width: 900px;
  margin: 0 auto;
}

.survey-intro {
  line-height: 1.8;
  color: #555;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ff6a00;
}

.section {
  margin-bottom: 2rem;
}

.subsection {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-text {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form-actions {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 1rem 0;
  border-top: 2px solid #e0e0e0;
}

.success-card {
  text-align: center;
  padding: 3rem;
}
</style>
