<script setup>
import { deliverGoodsCommit, deliverGoodsDetail } from "@/api/purchase/list";
import { useRouter, useRoute } from "vue-router";
import Table from "@/components/table/index.vue";
import { ElMessage } from "element-plus";
const router = useRouter();
const route = useRoute();

let id = route.path.split("/")[3];
const tableData = ref([]);
const tableDataCommon = ref("");
let loading = ref(false);
const receiveStatus = ref("");
const getDeliveryGoodsDetail = async () => {
  loading.value = true;
  await deliverGoodsDetail(id)
    .then((result) => {
      tableDataCommon.value = result.data;
      receiveStatus.value = tableDataCommon.value.receiveStatus;
      tableData.value = result.data.deliveryOrderDetails;
    })
    .finally(() => {
      loading.value = false;
    });
};
getDeliveryGoodsDetail();

let options = [
  {
    label: "行号",
    prop: "poLine",
    width: "60",
  },
  {
    label: "物料",
    prop: "item",
    align: "center",

    // width: 120
  },
  {
    label: "说明",
    prop: "description",
    align: "center",
    // slot: "purchaseNumber",

    // width: 120
  },

  // {
  //   label: "采购单号",
  //   prop: "poNum",
  //   align: "center",
  //   slot: "name",
  //   width: 300,
  // },
  // {
  //   label: "供应商编码",
  //   prop: "vendNum",
  //   align: "center",
  // },
  {
    label: "签收状态",
    slot: "status",
    align: "center",
    // props: "qtyDelivery",
  },
  {
    label: "备注",
    prop: "remark",
    align: "center",
    // width: "60",
  },

  {
    label: "签收",
    action: true,
    align: "center",
  },
];

const commitDliveryGoodsQuantity = async () => {
  await deliverGoodsCommit(JSON.parse(JSON.stringify(tableDataCommon.value))).then(
    (res) => {
      ElMessage.success(res.msg);
    }
  );
};
</script>

<template>
  <div class="deliverGoodsDetail">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>采购单号：{{ tableDataCommon.poNum }}</span>
          <el-button
            v-if="!receiveStatus > 0"
            class="button"
            type="primary"
            @click="commitDliveryGoodsQuantity"
            >签收操作</el-button
          >
        </div>
      </template>
      <div class="detail-list">
        <div class="detail-list-item">供应商编码：{{ tableDataCommon.vendNum }}</div>
        <div class="detail-list-item">
          供应商：<el-tag size="large">{{ tableDataCommon.vendName }}</el-tag>
        </div>
      </div>
    </el-card>
    <el-card class="boxList-card">
      <Table :data="tableData" :options="options">
        <template #status="{ scope }">
          <el-tag size="large" type="warning" class="status-item">
            <span>送货数量： {{ scope.row.qtyDelivery }}</span></el-tag
          ><br /><el-tag size="large" class="status-item">
            <span>已签收： {{ scope.row.qtyReceive }}</span></el-tag
          ><br />
          <el-tag size="large" class="status-item"
            ><span>单位： {{ scope.row.umdesc }}</span></el-tag
          ><br />
        </template>
        <template #action="{ scope }"
          ><el-input-number
            v-model="scope.row.qtyReceive"
            :min="0"
            :max="scope.row.qtyDelivery"
          />
        </template>
      </Table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 100%;
}

.boxList-card {
  width: 100%;
  margin-top: 3px;
  padding-bottom: 1.5px;
}

.status-item {
  margin-top: 5px;
}

.detail-list {
  display: flex;
  flex-wrap: wrap;

  .detail-list-item {
    height: 30px;
    width: calc(100% / 4);
    // background-color: #287;
    padding: 5px;
  }
}
</style>
