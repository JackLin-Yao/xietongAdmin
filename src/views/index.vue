<template>
  <div class="dashborder">
    <div class="notice-bar-container layout-pd">
      <NoticeBar :text="`🎉🎉🎉${message}`" background="#ecf5ff" color="#409eff" />
    </div>
    <div class="banner">
      <el-row :gutter="10">
        <el-col :md="24" :lg="18">
          <div class="welcome suspension">
            <img class="welcome-img" :src="headerSvg" alt="" />
            <div class="welcome-text">
              <div class="welcome-title">{{ name + getGreet() }}</div>
              <div class="welcome-note">持续创新，传承工匠精神；卓越品质，满足客户需求；以人为本，成就员工价值；精益求精，创造股东利益；实业兴邦，承担社会责任。
              </div>
            </div>
          </div>
        </el-col>
        <el-col :lg="6" class="hidden-md-and-down">
          <div class="working">
            <img class="working-coffee" :src="coffeeSvg" alt="" />
            <div class="working-text">
              你已经工作了<span class="time">{{ workingTimeResult }}</span>
            </div>
            <div @click="onChangeWorkState()" class="working-opt working-rest">
              {{ pauseWork ? '继续工作' : '休息一下' }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="small-panel-box">
      <el-row :gutter="20">
        <el-col :sm="12" :lg="6">
          <div class="small-panel user-reg suspension">
            <div class="small-panel-title">1233</div>
            <div class="small-panel-content">
              <div class="content-left">

                <span id="user_reg_number">5456</span>
              </div>
              <div class="content-right">+14%</div>
            </div>
          </div>
        </el-col>
        <el-col :sm="12" :lg="6">
          <div class="small-panel file suspension">
            <div class="small-panel-title">1235</div>
            <div class="small-panel-content">
              <div class="content-left">

                <span id="file_number">1234</span>
              </div>
              <div class="content-right">+50%</div>
            </div>
          </div>
        </el-col>
        <el-col :sm="12" :lg="6">
          <div class="small-panel users suspension">
            <div class="small-panel-title">5156</div>
            <div class="small-panel-content">
              <div class="content-left">

                <span id="users_number">9486</span>
              </div>
              <div class="content-right">+28%</div>
            </div>
          </div>
        </el-col>
        <el-col :sm="12" :lg="6">
          <div class="small-panel addons suspension">
            <div class="small-panel-title">121</div>
            <div class="small-panel-content">
              <div class="content-left">

                <span id="addons_number">875</span>
              </div>
              <div class="content-right">+88%</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="growth-chart">
      <el-row :gutter="20">
        <el-col class="lg-mb-20" :xs="24" :sm="24" :md="12" :lg="9">
          <el-card shadow="hover" header="growth">
            <div class="user-growth-chart"></div>
          </el-card>
        </el-col>
        <el-col class="lg-mb-20" :xs="24" :sm="24" :md="12" :lg="9">
          <el-card shadow="hover" header="growth">
            <div class="file-growth-chart"></div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6">
          <el-card class="new-user-card" shadow="hover" header="通知公告">
            <div class="new-user-growth">
              <el-scrollbar>

                <div class="new-user-item" v-for="(item, index) in noticeResult" :key="item.noticeId">
                  <div class="new-user-base" @click="DialogVisible(index)">
                    <div class="new-user-name">{{ item.noticeTitle }}</div>
                    <div class="new-user-time">{{ item.createBy }}{{ " 创建于 " + item.createTime }} </div>

                  </div>
                  <el-dialog v-model="centerDialogVisible" :title=item.noticeTitle width="30%" center
                    v-if="currentIndex == index">
                    <span style="white-space: pre-line">
                      {{ item.noticeContent }}
                    </span>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button type="primary" @click="centerDialogVisible = false">
                          确认
                        </el-button>
                      </span>
                    </template>
                  </el-dialog>
                </div>
              </el-scrollbar>
            </div>

          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>


</template>

<script setup name="Index">
import NoticeBar from '@/components/noticeBar/index.vue';
import { reactive } from 'vue';
import * as echarts from 'echarts'
import { getNotice, listNotice } from '@/api/system/notice';
import headerSvg from '@/assets/dashboard/header-1.svg'
import coffeeSvg from '@/assets/dashboard/coffee.svg'
import useUserStore from '@/store/modules/user'
import { getGreet, Local } from '@/utils/tool';
import { ElMessage, ElMessageBox } from 'element-plus'


const userStore = useUserStore()
const { name } = storeToRefs(userStore)


const message = ref('')

const getNoticeMessage = () => {
  getNotice(2).then((res) => {
    message.value = res.data.noticeTitle
  })

}
getNoticeMessage()

let noticeResult = ref('')

const getNoticeMessageList = () => {

  listNotice().then((result) => {
    noticeResult.value = result.rows
  })
}
getNoticeMessageList()

const centerDialogVisible = ref(false)
const currentIndex = ref('')
const DialogVisible = (index) => {
  currentIndex.value = index
  centerDialogVisible.value = true
}

const pauseWork = ref(false)
let workingTimeResult = ref('')
let workTimer
// 工作时间
const WORKING_TIME = 'workingTime'
const dataTime = new Date()
const startWork = () => {
  const workingTime = Local.get(WORKING_TIME) || { date: '', startTime: 0, pauseTime: 0, startPauseTime: 0 }
  const currentDate = dataTime.getFullYear() + '-' + (dataTime.getMonth() + 1) + '-' + dataTime.getDate()
  const time = parseInt((new Date().getTime() / 1000).toString())

  if (workingTime.date != currentDate) {
    workingTime.date = currentDate
    workingTime.startTime = time
    workingTime.pauseTime = workingTime.startPauseTime = 0
    Local.set(WORKING_TIME, workingTime)
  }

  let startPauseTime = 0
  if (workingTime.startPauseTime <= 0) {
    pauseWork.value = false
    startPauseTime = 0
  } else {
    pauseWork.value = true
    startPauseTime = time - workingTime.startPauseTime // 已暂停时间
  }

  let workingSeconds = time - workingTime.startTime - workingTime.pauseTime - startPauseTime

  workingTimeResult.value = formatSeconds(workingSeconds)
  if (!pauseWork.value) {
    workTimer = setInterval(() => {
      workingSeconds++
      workingTimeResult.value = formatSeconds(workingSeconds)
    }, 1000)
  }
}

const formatSeconds = (seconds) => {
  var secondTime = 0 // 秒
  var minuteTime = 0 // 分
  var hourTime = 0 // 小时
  var dayTime = 0 // 天
  var result = ''

  if (seconds < 60) {
    secondTime = seconds
  } else {
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = Math.floor(seconds / 60)
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = Math.floor(seconds % 60)
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime >= 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = Math.floor(minuteTime / 60)
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = Math.floor(minuteTime % 60)
      if (hourTime >= 24) {
        // 获取天数， 获取小时除以24，得到整数天
        dayTime = Math.floor(hourTime / 24)
        // 获取小时后取余小时，获取分钟除以24取余的分；
        hourTime = Math.floor(hourTime % 24)
      }
    }
  }

  result = hourTime + '小时' + ((minuteTime >= 10 ? minuteTime : '0' + minuteTime) + '分钟') + ((secondTime >= 10 ? secondTime : '0' + secondTime) + '秒')
  if (dayTime > 0) {
    result = dayTime + '天' + result
  }
  return result
}
const onChangeWorkState = () => {
  const time = parseInt((new Date().getTime() / 1000).toString())
  const workingTime = Local.get(WORKING_TIME)
  if (pauseWork.value) {
    // 继续工作
    workingTime.pauseTime += time - workingTime.startPauseTime
    workingTime.startPauseTime = 0
    Local.set(WORKING_TIME, workingTime)
    pauseWork.value = false
    startWork()
  } else {
    // 暂停工作
    workingTime.startPauseTime = time
    Local.set(WORKING_TIME, workingTime)
    clearInterval(workTimer)
    pauseWork.value = true
  }
}
onMounted(() => {
  startWork()
})

</script>

<style scoped lang="scss">
.dashborder {
  // background-color: #e9edf2;
  width: 100%;
  // min-height: 870px;

  .banner {
    margin: 10px;
  }
}

.welcome {
  background: rgb(64, 158, 255, 34%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  padding: 15px 20px !important;
  margin-left: 10px;
  box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);

  .welcome-img {
    height: 100px;
    margin-right: 10px;
    user-select: none;
  }

  .welcome-title {
    font-size: 1.5rem;
    line-height: 30px;
    color: var(--ba-color-primary-light);
  }

  .welcome-note {
    padding-top: 6px;
    font-size: 15px;
    color: var(--el-text-color-primary);
  }
}

.working {
  height: 130px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
  position: relative;

  &:hover {
    .working-coffee {
      -webkit-transform: translateY(-4px) scale(1.02);
      -moz-transform: translateY(-4px) scale(1.02);
      -ms-transform: translateY(-4px) scale(1.02);
      -o-transform: translateY(-4px) scale(1.02);
      transform: translateY(-4px) scale(1.02);
      z-index: 999;
    }
  }

  .working-coffee {
    transition: all 0.3s ease;
    width: 80px;
  }

  .working-text {
    display: block;
    width: 100%;
    font-size: 15px;
    text-align: center;
    color: var(--el-text-color-primary);
  }

  .working-opt {
    position: absolute;
    top: -40px;
    right: 10px;
    background-color: rgba($color: #000000, $alpha: 0.3);
    padding: 10px 20px;
    border-radius: 20px;
    color: var(--ba-bg-color-overlay);
    transition: all 0.3s ease;
    cursor: pointer;
    opacity: 0;
    z-index: 999;

    &:active {
      background-color: rgba($color: #000000, $alpha: 0.6);
    }
  }

  &:hover {
    .working-opt {
      opacity: 1;
      top: 0;
    }

    .working-done {
      opacity: 1;
      top: 50px;
    }
  }
}

.small-panel-box {
  margin: 20px;
}

.small-panel {
  background: rgb(64, 158, 255, 12%);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;

  .small-panel-title {
    color: #92969a;
    font-size: 15px;
  }

  .small-panel-content {
    display: flex;
    align-items: flex-end;
    margin-top: 20px;
    color: #2c3f5d;

    .content-left {
      font-size: 24px;

      .icon {
        margin-right: 10px;
      }

      span {
        display: inline-block;
        font-size: 28px;
      }
    }

    .content-right {
      font-size: 18px;
      margin-left: auto;
    }

    .color-success {
      color: var(--el-color-success);
    }

    .color-warning {
      color: var(--el-color-warning);
    }

    .color-danger {
      color: var(--el-color-danger);
    }

    .color-info {
      color: var(--el-text-color-secondary);
    }
  }
}

.growth-chart {
  margin: 15px;
}

.user-growth-chart,
.file-growth-chart {
  height: 300px;
}

.new-user-growth {
  height: 300px;
}



.new-user-item {
  display: flex;
  align-items: center;
  box-sizing: border-box;

  padding: 20px;
  margin: 20px 15px;
  box-shadow: 0 0 3px 0 rgba(82, 63, 105, 0.15);
  background-color: rgb(64, 158, 255, 12%);



  .new-user-base {
    margin-left: 10px;
    width: 100%;
    height: 100%;
    color: #2c3f5d;

    .new-user-name {
      font-size: 15px;
    }

    .new-user-time {
      margin-top: 5px;
      font-size: 13px;
    }
  }

  .new-user-arrow {
    margin-left: auto;
  }
}

.new-user-card :deep(.el-card__body) {
  padding: 0;
}

@media screen and (max-width: 425px) {
  .welcome-img {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .lg-mb-20 {
    margin-bottom: 10px;
  }
}

/* 鼠标置入浮动效果-s */
.suspension {
  transition: all 0.2s ease;
}

.suspension:hover {
  -webkit-transform: translateY(-4px) scale(1.02);
  -moz-transform: translateY(-4px) scale(1.02);
  -ms-transform: translateY(-4px) scale(1.02);
  -o-transform: translateY(-4px) scale(1.02);
  transform: translateY(-4px) scale(1.02);
  -webkit-box-shadow: 0 14px 24px rgba(0, 0, 0, 0.2);
  box-shadow: 0 14px 24px rgba(0, 0, 0, 0.2);
  z-index: 999;
  border-radius: 6px;
}
</style>

