<template>
  <chart :options="opcoesGrafico" />
</template>

<script>
import { Chart } from 'highcharts-vue';
import firebaseDb from '../firebaseDb';

export default {
  components: {
    Chart
  },
  props: {
    estadoSelecionado: {
      type: String,
      default: ''
    },
    cidadeSelecionado: {
      type: String,
      default: ''
    },
    cargo: {
      type: String,
      default: ''
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
          text: this.cargo === 'Presidente' ? this.cargo + 's mais votados' : this.cargo + 'es mais votados',
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Total de votos'
          }
        },
        colors: ['#0B73D9'],
        series: [{
          name: '',
          data: []
        }],
        plotOptions: {
          series: {
            cursor: 'pointer'
          }
        }
      }
    }
  },
  methods: {
    async carregarDados() {
      const collection = 'BoletimUrna_' + this.estadoSelecionado.toUpperCase() + '_22';

      let filtros = [{
        nomeCampo: 'DS_CARGO_PERGUNTA',
        operacao: '==',
        valorCampo: this.cargo
      }];

      if (this.cidadeSelecionado != '') {
        console.log(this.cidadeSelecionado)
        filtros.push({
          nomeCampo: 'NM_MUNICIPIO',
          operacao: '==',
          valorCampo: this.cidadeSelecionado
        });
      }

      const votos = await firebaseDb().query(collection, filtros);

      let candidatos = {};
      votos.forEach(voto => {
        if (candidatos[voto['NM_VOTAVEL']] == null) {
          candidatos[voto['NM_VOTAVEL']] = 0;
        }

        candidatos[voto['NM_VOTAVEL']] += voto['QT_VOTOS'];
      });

      const candidatosOrdenado = Object.fromEntries(
        Object.entries(candidatos).sort(([,a],[,b]) => b - a)
      );

      let dados = [];
      let categorias = [];
      for (let candidato in candidatosOrdenado) {
        dados.push(candidatosOrdenado[candidato]);
        categorias.push(candidato);
      }

      this.opcoesGrafico.xAxis.categories = categorias;
      this.opcoesGrafico.series = [{
        name: this.cargo,
        data: dados
      }];
    }
  },
  watch: {
    estadoSelecionado() {
      this.carregarDados();  
    },
    cidadeSelecionado() {
      this.carregarDados();
    }
  }
}
</script>
