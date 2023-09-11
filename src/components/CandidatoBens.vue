<template>
  <div class="mb-5">
    <h2>Confira os bens declarados por um candidato(a):</h2>
    <h4 v-if="dadosBens === ''">
      Nenhum bem encontrado para o candidato(a) {{ candidatoSelecionado.nome }}
    </h4>
    <!-- TODO: tabs para ver bens declarados dos anos de 2018 e 2022 -->
    <div 
      v-else-if="!!dadosBens"
      class="shadow-sm bg-white px-5 py-3 border border-info mb-5"
      style="border-radius: 20px;"
    >
      <h3><strong>{{ candidatoSelecionado.nome }}</strong></h3>
      <hr class="bg-info"/>
      <p 
        v-for="bem in bens" :key="bem.key"
        class="d-flex justify-content-between mb-1"
      >
        <span>{{ bem.descricao }}</span> 
        <strong class="text-success">R$ {{ bem.valor }}</strong>
      </p>
      <p class="h3" style="text-align: right">
        <span class="mr-2">Total em bens:</span> 
        <strong class="text-success">R$ {{ totalFormatado }}</strong>
      </p>
    </div>
    <div 
      v-else
      class="shadow-sm px-5 py-3 border border-info bg-white"
      style="border-radius: 20px;"
    >
      <h3>Selecione um candidato na tabela acima</h3>
    </div>
  </div>
</template>

<script>
// TODO: colocar ícones para cada tipo de bem (casa, veículo, etc...). Fazer um componente que recebe o número do tipo de bem e renderiza um ícone (ver documentação.txt)
import firebaseDb from '../firebaseDb';
import Utils from '../utils';

export default {
  props: {
    candidatoSelecionado: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dadosBens: null,
      totalEmBens: 0,
      bens: []
    }
  },
  watch: {
    async candidatoSelecionado(valorAtual) {
      this.totalEmBens = 0;
      this.bens = 0;

      if (valorAtual.st_declarar_bens === 'N') {
        this.dadosBens = ''; 
        return;
      }

      const dados = await firebaseDb().query('BemCandidato_' + valorAtual.uf, [{
        nomeCampo: 'SQ_CANDIDATO',
        operacao: '==',
        valorCampo: valorAtual.sq_candidato
      }]);

      if (dados.length === 0) {
        this.dadosBens = '';
      } else {
        this.dadosBens = dados;
      }
    },
    dadosBens(valorAtual) {
      if (valorAtual === '') {
        return;
      }

      let totalEmBens = 0;
      let bens = [];
      valorAtual.forEach(bem => {
        totalEmBens += parseFloat(bem['VR_BEM_CANDIDATO'].replace(',','.'));
        bens.push({ 
          descricao: bem['DS_TIPO_BEM_CANDIDATO'],
          valor: Utils().formatarNumero(bem['VR_BEM_CANDIDATO'].replaceAll(',','.')),
          key: bem['NR_ORDEM_CANDIDATO']
        });
      });

      this.totalEmBens = totalEmBens.toFixed(2);
      this.bens = bens;
    }
  },
  computed: {
    totalFormatado() {
      return Utils().formatarNumero(this.totalEmBens);
    }
  }
}
</script>
