<template>
  <div>
    <chart :options="opcoesGrafico" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import firebaseDb from '../firebaseDb';

export default {
  components: {
    Chart
  },
  props: {
    candidatoSelecionado: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      opcoesGrafico: {
        chart: {
          type: 'column',
          reflow: true,
          zoomType: 'xy',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [
            '2018',
            '2022'
          ]
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Gastos (R$)'
          }
        },
        colors: ['#0B73D9'],
        series: [{
          name: '',
          data: [0, 0]
        }],
        plotOptions: {
          series: {
            cursor: 'pointer'
          }
        }
      }
    }
  },
  watch: {
    candidatoSelecionado: {
      async handler(valorAtual) {
        let ano2018 = valorAtual.gastos_campanha_2018 ? valorAtual.gastos_campanha_2018 : 0;
        let ano2022 = valorAtual.gastos_campanha_2022 ? valorAtual.gastos_campanha_2022 : 0;

        if (valorAtual.gastos_campanha_2018 === 0) {
          ano2022 = valorAtual.gastos_campanha_2022;
          ano2018 = await firebaseDb().query('Canditatos_'+valorAtual.uf+'_18', [{
            nomeCampo: 'NR_CANDIDATO',
            operacao: '==',
            valorCampo: valorAtual.numero_urna
          }]);

          ano2018 = ano2018.length > 0 ? ano2018[0]['VR_DESPESA_MAX_CAMPANHA'] : 0;
        } else if (valorAtual.gastos_campanha_2022 === 0) {
          ano2018 = valorAtual.gastos_campanha_2018;
          ano2022 = await firebaseDb().query('Canditatos_'+valorAtual.uf, [{
            nomeCampo: 'NR_CANDIDATO',
            operacao: '==',
            valorCampo: valorAtual.numero_urna
          }]);

          ano2022 = ano2022.length > 0 ? ano2022[0]['VR_DESPESA_MAX_CAMPANHA'] : 0;
        } 
        
        this.$emit('atualizarTotalCandidato', ano2018 + ano2022);

        this.opcoesGrafico.series = [{
          name: valorAtual['nome'],
          data: [
            ano2018,
            ano2022
          ]
        }];

        if (ano2018 <= 1 && ano2022 <= 1) {
          this.opcoesGrafico.series = [{
            name: '',
            data: [0, 0]
          }];
        }
      },
      immediate: true
    }
  }
}
</script>