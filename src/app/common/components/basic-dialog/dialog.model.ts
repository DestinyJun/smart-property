export class DialogModel {
  type: any; // add/modify/detail
  title: any; // title
  width: any;
}
export class FromData {
  label?: any; // 名字
  type?: any;  // 类型
  name?: any;  //
  placeholder?: any; // 提示
  option?: any; // 下拉框的列表
  value?: any;  // 单选，多选的列表
  disable?: any;  // 单选，多选的列表
}
export class FormValue {
  key: any;
  disabled?: any;
  required?: any;
}
export class DataTree {
  code?: any;
  name?: any;
  pid?: any;
  villageChoose2DTO?: DataTree[];
}
