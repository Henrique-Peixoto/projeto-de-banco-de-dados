<template>
  <highcharts
    :options="op"
    :constructor-type="'mapChart'"
  />  
</template>

<script>
import { Chart } from 'highcharts-vue';
import HC from 'highcharts';
import Highmaps from 'highcharts/modules/map';
import exportingInit from 'highcharts/modules/exporting'
import BR from '../br-all.geo.json';

exportingInit(HC);
Highmaps(HC);
HC.maps['brasil'] = BR;

export default {
  components: {
    highcharts: Chart
  },
  data() {
    return {
      op: {
        chart: {
          map: 'brasil',
          height: 400,
          reflow: true
        },
        title: {
          text: 'Selecione um estado'
        },
        plotOptions: {
          map: {
            events: {
              click: (e) => {
                if (e.point['hc-key']){
                  this.$emit('selecionarEstado', e.point['hc-key'].split('-')[1]);
                }
              }
            }
          },
          series: {
            cursor: 'pointer'
          }
        },
        colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: '#10244D',
          stops: [
            [0, '#FFFFFF'],
            [0.3, '#0B73D9'],
            [1, '#10244D']
          ]
        },
        legend: false,
        series: [{
          name: 'Empresas por estado',
          states: {
            hover: {
              color: '#BADA55'
            },
          },
          dataLabels: {
            overflow: 'justify',
            enabled: true,
            format: '{point.name}'
          },
          data: 
            [["br-ac",0],["br-al",0],["br-am",0],["br-ap",0],["br-ba",0],["br-ce",0],["br-df",0],["br-es",0],["br-go",0],["br-ma",0],["br-mg",0],["br-ms",0],["br-mt",0],["br-pa",0],["br-pb",0],["br-pe",0],["br-pi",0],["br-pr",0],["br-rj",0],["br-rn",0],["br-ro",0],["br-rr",0],["br-rs",0],["br-sc",0],["br-se",0],["br-sp",0],["br-to",0]]
        }],
      }
    }
  },
}
</script>

<!-- <style>
/deep/ .highcharts-button-box {
  display: none !important;
}
</style> -->