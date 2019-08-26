export class Patyment {
  organizationId?: any; // 组织id
  organizationName?: any; // 组织id
  villageCode?: any; // 组织id
  villageName?: any; // 组织id
  regionCode?: any; // 组织id
  regionName?: any; // 组织id
  buildingCode?: any; // 组织id
  buildingName?: any; // 组织id
  unitCode?: any; // 组织id
  unitName?: any; // 组织id
  roomCode?: any; // 组织id
  roomSize?: any; // 组织id
  userId?: any; // 组织id
  mobilePhone?: any; // 组织id
  surname?: any; // 组织id
  dueTime?: any; // 组织id
}
// 项目选则状态记录
export class ChargeItem {
  chargeCode?: any; // 项目编号
  chargeName?: any; // 项目名称
  chargeType?: any; // 项目类型
  chargeWay?: any; // 项目类型
  datedif?: any; // 项目类型
  check?: any; // 选中状态
}
// 项目选择提交
export class ChargeItemData {
  roomSize?: any; // 房间面积
  dueTime?: any; // 物业费到期时间
  chargeItem?: ChargeItems[] = [];
}
// 项目选则
export class ChargeItems {
  chargeCode?: any; // 项目编号
  chargeName?: any; // 项目名称
  chargeType?: any; // 项目类型
  datedif?: any; // 项目月数
}

// 增加订单
export class ChargePaymentAddOrder {
  organizationId?: any; // 组织/机构ID
  organizationName?: any; // 组织/机构名称
  villageCode?: any; // 小区编号
  villageName?: any; // 小区名称
  regionCode?: any; // 地块编号
  regionName?: any; // 地块名称
  buildingCode?: any; // 楼栋编号
  buildingName?: any; // 楼栋名称
  unitCode?: any; // 单元编号
  unitName?: any; // 单元名称
  roomCode?: any; // 房屋编号
  roomSize?: any; // 建筑面积
  userId?: any; // 组织id
  surname?: any; // 业主姓名
  mobilePhone?: any; // 客户电话
  payerPhone?: any; // 付款人电话
  payerName?: any; // 付款人姓名
  paymentMethod?: any; // 付款方式
  amountTotalReceivable?: any; // 总应收金额
  actualTotalMoneyCollection?: any; // 总实收金额
  surplus?: any; // 修正金额
  remark?: any; // 备注
  chargeItemCostDTO?: ChargeItemDetail[] = []; // 项目收费明细
}
// 项 目 收 费 详 情
export class ChargeItemDetail {
  actualMoneyCollection?: any; // 实收金额
  amountReceivable?: any; // 应收金额
  chargeCode?: any; // 项目编号
  chargeName?: any; // 项目名称
  chargeStandard?: any; // 标准单位
  chargeType?: any; // 计算类型
  chargeUnit?: any; // 单位
  datedif?: any; // 缴费月数
  discont?: any; // 折扣率
  dueTime?: any; // 计费结束时间
  preferentialAmount?: any; // 优惠金额
  startTime?: any; // 计费开始时间
  usageAmount?: any; // 使用量
  currentReadings?: any; // 当前读数
  lastReading?: any; // 上次读数
}
export  class SearchData {
  pageNo: any;
  pageSize: any;
  mobilePhone: any;
  roomCode: any;
}
