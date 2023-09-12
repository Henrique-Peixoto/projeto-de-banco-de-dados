<template>
  <div>
    <h2>Veja os candidatos a presidente e a governador mais votados por município</h2>
    <div 
      class="shadow-sm border border-info px-5 py-3 mb-5 bg-white"
      style="border-radius: 20px;"
    >
      <Treeselect 
        v-model="selecionadoCidade"
        placeholder="Selecione um estado"
        class="mb-3"
        no-options-text="Nenhum opção disponível"
        no-results-text="Nenhuma cidade corresponde à pesquisa"
        :options="cidades"
      />
      <div class="d-flex">
        <GraficoMaisVotado 
          :estado-selecionado="estadoSelecionado"
          :cidade-selecionado="selecionadoCidade"
          cargo="Presidente"
        />
        <GraficoMaisVotado 
          :estado-selecionado="estadoSelecionado"
          :cidade-selecionado="selecionadoCidade"
          cargo="Governador"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import GraficoMaisVotado from './GraficoMaisVotado';
import cidadesDoBrasil from '../cidades.js';
import Utils from '../utils.js';

export default {
  components: {
    Treeselect,
    GraficoMaisVotado
  },
  props: {
    estadoSelecionado: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selecionadoCidade: null,
      cidades: []
    }
  },
  watch: {
    selecionadoCidade(v) {
      console.log(v);
    },
    estadoSelecionado(estado) {
      let cidades = [];

      cidadesDoBrasil.forEach(cidade => {
        if (cidade.uf === estado.toUpperCase()) {
          cidades.push({
            id:cidade.id,
            label: cidade.name.split(' ').slice(0, -2),
            labelSemAcento: Utils().normalizarString(cidade.name)
          });
        }
      });

      this.cidades = cidades.sort((a, b) => a.labelSemAcento < b.labelSemAcento ? -1 : a.labelSemAcento > b.labelSemAcento ? 1 : 0);
    }
  }
}
</script>