<template>
  <div class="px-5 bg-light">
    <CandidatoFiltragem 
      @selecionarCandidato="selecionarCandidato"
    />
    <GastosCampanha 
      :candidato-selecionado="candidatoSelecionado"
    />
    <CandidatoBens 
      :candidato-selecionado="candidatoSelecionado"
    />
    <MaisVotadosPorEstado 
      @selecionarEstado="selecionarEstado"
    />
    <MaisVotadosPorMunicipio 
      :estado-selecionado="estadoSelecionado"
    />
  </div>
</template>

<script>
import CandidatoFiltragem from './CandidatoFiltragem.vue';
import CandidatoBens from './CandidatoBens.vue';
import GastosCampanha from './GastosCampanha.vue';
import MaisVotadosPorEstado from './MaisVotadosPorEstado.vue';
import MaisVotadosPorMunicipio from './MaisVotadosPorMunicipio.vue';

export default {
  name: 'PaginaPrincipal',
  components: {
    CandidatoFiltragem,
    CandidatoBens,
    GastosCampanha,
    MaisVotadosPorEstado,
    MaisVotadosPorMunicipio
  },
  data() {
    return {
      candidatoSelecionado: {},
      estadoSelecionado: ''
    }
  },
  methods: {
    selecionarCandidato(candidato) {
      this.candidatoSelecionado = candidato;  
    },
    selecionarEstado(estado) {
      this.estadoSelecionado = estado;
    }
  }
}
</script>
