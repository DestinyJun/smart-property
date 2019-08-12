import {Component, Input, OnInit} from '@angular/core';
import { graphic, registerMap } from 'echarts';
@Component({
  selector: 'rbi-echarts-pie-general',
  templateUrl: './echarts-pie-general.component.html',
  styleUrls: ['./echarts-pie-general.component.less']
})
export class EchartsPieGeneralComponent implements OnInit {
  @Input() public lineData: any;
  @Input() public barData: any;
  @Input() public data: any;
  public option: any;
  constructor() { }
  ngOnInit() {

    this.option = {
      backgroundColor: '#33353C',
      grid: {
        top: '12',
        bottom: '24',
        // right:'14'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
            backgroundColor: '#333'
          }
        }
      },
      xAxis: {
        data: this.data,
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      yAxis: {
        splitLine: {show: false},
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      series: [ {
        name: 'bar',
        type: 'bar',
        barWidth: 12,
        itemStyle: {
          normal: {
            barBorderRadius: 10,
            color: new graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 0, color: '#5194D8'},
                {offset: 1, color: '#133E64'}
              ]
            ),
          },
          left: 15
        },
        data: this.barData
      }, {
        name: 'line',
        type: 'bar',
        barGap: '-127%',
        barWidth: 20,
        itemStyle: {
          normal: {
            color: '#4D4C52'
          }
        },
        z: -8,
        data: this.lineData
      }]
    };
  }

}
