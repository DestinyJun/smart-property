export class DialogModel {
  type: any; // add/modify/detail
  title: any; // title
  width: any;
  dataList: DialogType[];
}
export class DialogType {
  type: any;
  name: any;
  value: DialogValue;
}
export class DialogValue {
  radioBox: DialogRedioList[];
  input: DialogInput;
  dropdown: DialogDropdown;
  date: DialogDate;
  textBox: Dialogtext;
}
export class DialogRedioList {
  name: any;
  label: any;
  value: any;
  data: any;
}
export class DialogInput {
  label: any;
  value: any;
  filter: any;
}
export class DialogDropdown {
  value: any;
  label: any;
  option: any[];
}
export class DialogDate {
  label: any;
  value: any;
}
export class Dialogtext {
  label: any;
  value: any;
  row: any;
  col: any;
}
