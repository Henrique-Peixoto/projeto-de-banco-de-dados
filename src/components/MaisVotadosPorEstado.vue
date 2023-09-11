<template>
  <div>
    <h2>Veja os candidatos a presidente e a governador mais votados por estado</h2>
    <div class="d-flex mb-5">
      <GraficoMapaEstados 
        class="w-50 mr-2 border border-info shadow-sm d-flex align-items-center bg-white"
        style="border-radius: 20px;"
        @selecionarEstado="selecionarEstado"
      />
      <div>
        <GraficoMaisVotado 
          class="border border-info shadow-sm mb-2"
          style="border-radius: 20px; height: 250px;"
          :estado-selecionado="estadoSelecionado"
          cargo="Presidente"
        />
        <GraficoMaisVotado 
          class="border border-info shadow-sm"
          style="border-radius: 20px; height: 250px;"
          :estado-selecionado="estadoSelecionado"
          cargo="Governador"
        />
      </div>
    </div>
  </div>
</template>

<script>
import GraficoMapaEstados from './GraficoMapaEstados';
import GraficoMaisVotado from './GraficoMaisVotado';

export default {
  components: {
    GraficoMapaEstados,
    GraficoMaisVotado
  },
  data() {
    return {
      estadoSelecionado: ''
    }
  },
  methods: {
    selecionarEstado(estado) {
      this.estadoSelecionado = estado;
      this.$emit('selecionarEstado', estado);
    }
  }
}
</script>
