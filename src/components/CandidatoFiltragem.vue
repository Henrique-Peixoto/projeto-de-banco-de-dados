<template>
  <div 
    class="mb-5 border border-info px-5 py-3"
    style="border-radius: 20px;"
  >
    <h2>Pesquise por candidatos usando os seguintes filtros:</h2>
    <div class="d-flex mb-2 flex-column">
      <div class="d-flex mb-2">
        <Treeselect 
          class="mr-2"
          v-model="selecionadoAno"
          placeholder="Ano"
          :options="opcoesAno"
        />
        <Treeselect
          class="mr-2" 
          v-model="selecionadosUf"
          placeholder="UF"
          :options="opcoesUf"
        />
        <Treeselect 
          class="mr-2" 
          v-model="selecionadoGenero"
          placeholder="Gênero"
          :options="opcoesGenero"
        />
      </div>
      <div class="d-flex">
        <Treeselect 
          class="mr-2" 
          v-model="selecionadoEscolaridade"
          placeholder="Escolaridade"
          :options="opcoesEscolaridade"
        />
        <Treeselect 
          class="mr-2" 
          v-model="selecionadoCor"
          placeholder="Cor/Raça"
          :options="opcoesCor"
        />
        <Treeselect
          class="mr-2"
          v-model="selecionadoPartido"
          placeholder="Partido"
          :options="opcoesPartido"
        />
        <Treeselect
          v-model="selecionadoCargo"
          placeholder="Cargo"
          :options="opcoesCargo"
        />
      </div>
      <!-- TODO: usar dois inputs para que o usuário defina o intervalo de pesquisa por idade -->
    </div>
    <hr class="bg-info"/>
    <b-table
      striped
      :items="candidatos"
      :fields="camposTabela"
      show-empty
      empty-text="Nenhum candidato(a) encontrado(a) com os filtros utilizados"
      :sort-by="sortBy"
      per-page="10"
      :current-page="paginaAtual"
      @row-clicked="selecionarCandidato"
    />
    <b-pagination 
      v-if="candidatos.length > 0"
      v-model="paginaAtual"
      :total-rows="candidatos.length"
      per-page="10"
      :current-page="paginaAtual"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import firebaseDb from '../firebaseDb';

export default {
  components: {
    Treeselect
  },
  data() {
    // ! Vou deixar opções preselecionadas para diminuir a quantidade de requests
    // Retirá-las para a versão final
    return {
      selecionadoAno: '2018',
      opcoesAno: [
        { id: '2018', label: '2018' },
        { id: '2022', label: '2022' }
      ],
      selecionadoGenero: 'MASCULINO',
      opcoesGenero: [
        { id: 'MASCULINO', label: 'Masculino' },
        { id: 'FEMININO', label: 'Feminino' },
        { id: 'NÃO DIVULGÁVEL', label: 'Não divulgável' }
      ],
      selecionadoEscolaridade: 'SUPERIOR COMPLETO',
      opcoesEscolaridade: [
        { id: 'SUPERIOR COMPLETO', label: 'Superior completo' },
        { id: 'SUPERIOR INCOMPLETO', label: 'Superior incompleto' },
        { id: 'ENSINO MÉDIO COMPLETO', label: 'Ensino médio completo' },
        { id: 'ENSINO MÉDIO INCOMPLETO', label: 'Ensino médio incompleto' },
        { id: 'ENSINO FUNDAMENTAL COMPLETO', label: 'Ensino fundamental completo' },
        { id: 'ENSINO FUNDAMENTAL INCOMPLETO', label: 'Ensino fundamental incompleto' },
        { id: 'LÊ E ESCREVE', label: 'Lê e escreve' },
        { id: 'NÃO DIVULGÁVEL', label: 'Não divulgável' }
      ],
      selecionadosUf: 'AC',
      opcoesUf: [
        { id: 'AC', label: 'AC' },
        { id: 'AL', label: 'AL' },
        { id: 'AP', label: 'AP' },
        { id: 'AM', label: 'AM' },
        { id: 'BA', label: 'BA' },
        { id: 'CE', label: 'CE' },
        { id: 'ES', label: 'ES' },
        { id: 'GO', label: 'GO' },
        { id: 'MA', label: 'MA' },
        { id: 'MT', label: 'MT' },
        { id: 'MS', label: 'MS' },
        { id: 'MG', label: 'MG' },
        { id: 'PA', label: 'PA' },
        { id: 'PB', label: 'PB' },
        { id: 'PR', label: 'PR' },
        { id: 'PE', label: 'PE' },
        { id: 'PI', label: 'PI' },
        { id: 'RJ', label: 'RJ' },
        { id: 'RN', label: 'RN' },
        { id: 'RS', label: 'RS' },
        { id: 'RO', label: 'RO' },
        { id: 'RR', label: 'RR' },
        { id: 'SC', label: 'SC' },
        { id: 'SP', label: 'SP' },
        { id: 'SE', label: 'SE' },
        { id: 'TO', label: 'TO' },
        { id: 'DF', label: 'DF' },
      ],
      selecionadoCor: 'BRANCA',
      opcoesCor: [
        { id: 'BRANCA', label: 'BRANCA' },
        { id: 'PRETA', label: 'PRETA' },
        { id: 'PARDA', label: 'PARDA' },
        { id: 'AMARELA', label: 'AMARELA' },
        { id: 'INDÍGENA', label: 'INDÍGENA' },
        { id: 'NÃO INFORMADO', label: 'NÃO INFORMADO' },
        { id: 'NÃO DIVULGÁVEL', label: 'NÃO DIVULGÁVEL' },
      ],
      selecionadoPartido: 'PT',
      opcoesPartido: [
        { id: 'MDB', label: 'MDB' },
        { id: 'PT', label: 'PT' },
        { id: 'PSDB', label: 'PSDB' },
        { id: 'PP', label: 'PP' },
        { id: 'PDT', label: 'PDT' },
        { id: 'UNIÃO', label: 'UNIÃO' },
        { id: 'PTB', label: 'PTB' },
        { id: 'PODE', label: 'PODE' },
        { id: 'PL', label: 'PL' },
        { id: 'PSB', label: 'PSB' },
        { id: 'REPUBLICANOS', label: 'REPUBLICANOS' },
        { id: 'CIDADANIA', label: 'CIDADANIA' },
        { id: 'PSD', label: 'PSD' },
        { id: 'PCDOB', label: 'PCDOB' },
        { id: 'SOLIDARIEDADE', label: 'SOLIDARIEDADE' },
        { id: 'PV', label: 'PV' },
        { id: 'PATRIOTA', label: 'PATRIOTA' },
        { id: 'PSOL', label: 'PSOL' },
        { id: 'AVANTE', label: 'AVANTE' },
        { id: 'PMN', label: 'PMN' },
        { id: 'AGIR', label: 'AGIR' },
        { id: 'DC', label: 'DC' },
        { id: 'PRTB', label: 'PRTB' },
        { id: 'PMB', label: 'PMB' },
        { id: 'REDE', label: 'REDE' },
        { id: 'NOVO', label: 'NOVO' },
        { id: 'PSTU', label: 'PSTU' },
        { id: 'PCB', label: 'PCB' },
        { id: 'UP', label: 'UP' },
        { id: 'PCO', label: 'PCO' }
      ],
      selecionadoCargo: 'PRESIDENTE',
      opcoesCargo: [
        { id: 'PRESIDENTE', label: 'PRESIDENTE' },
        { id: 'VICE-PRESIDENTE', label: 'VICE-PRESIDENTE' },
        { id: 'DEPUTADO FEDERAL', label: 'DEPUTADO FEDERAL' },
        { id: 'DEPUTADO ESTADUAL', label: 'DEPUTADO ESTADUAL' },
        { id: 'GOVERNADOR', label: 'GOVERNADOR' },
        { id: 'VICE-GOVERNADOR', label: 'VICE-GOVERNADOR' },
        { id: 'SENADOR', label: 'SENADOR' },
      ],
      sortBy: 'nome',
      paginaAtual: 1,
      camposTabela: [
        { key: 'nome', sortable: true },
        { key: 'cor' },
        { key: 'genero' },
        { key: 'grau_de_instrucao', label: 'Grau de instrução' },
        { key: 'idade', sortable: true },
        { key: 'nome_do_partido', label: 'Nome do partido' },
        { key: 'sigla_do_partido', label: 'Sigle do partido' },
        { key: 'uf', label: 'UF' },
        { key: 'cargo', label: 'Cargo' },
        { key: 'sq_candidato', tdClass: 'd-none', thClass: 'd-none' },
        { key: 'st_declarar_bens', tdClass: 'd-none', thClass: 'd-none' },
        { key: 'gastos_campanha', tdClass: 'd-none', thClass: 'd-none' }
      ],
      candidatos: []
    }
  },
  async mounted() {
    // Testar gráfico de gastos com campanha com o CLAUDIO DONIZETE, 1600, DP Federal, SP, PSTU, preta, superior incompleto

    // em 2022 é ensino médio completo

    // const ufs = [
    //   'AC',
    //   'AL',
    //   'AP',
    //   'AM',
    //   'BA',
    //   'CE',
    //   'ES',
    //   'GO',
    //   'MA',
    //   'MT',
    //   'MS',
    //   'MG',
    //   'PA',
    //   'PB',
    //   'PR',
    //   'PE',
    //   'PI',
    //   'RJ',
    //   'RN',
    //   'RS',
    //   'RO',
    //   'RR',
    //   'SC',
    //   'SP',
    //   'SE',
    //   'TO',
    //   'DF',
    // ];

    // let totalPartido = 0;
    // for (let i = 0; i < ufs.length; i++) {
    //   console.log(i)
    //   const dados = await firebaseDb().query('Canditatos_'+ufs[i]+'_18', [
    //     {
    //       nomeCampo: 'SG_PARTIDO',
    //       operacao: '==',
    //       valorCampo: 'PCO'
    //     }
    //   ]);
    //   dados.forEach(dado => totalPartido += parseFloat(dado['VR_DESPESA_MAX_CAMPANHA'].toString().replace(',','.')));
    // }
    // console.log(totalPartido);


    this.getCandidatos();
  },
  methods: {
    selecionarCandidato(item) {
      item.ano_eleicao = this.selecionadoAno;
      this.$emit('selecionarCandidato', item);
    },
    async getCandidatos() {
      let filtros = [];

      if (this.selecionadoGenero != null) {
        filtros.push({
          nomeCampo: 'DS_GENERO',
          operacao: '==',
          valorCampo: this.selecionadoGenero
        });
      }

      if (this.selecionadoEscolaridade != null) {
        filtros.push({
          nomeCampo: 'DS_GRAU_INSTRUCAO',
          operacao: '==',
          valorCampo: this.selecionadoEscolaridade
        });
      }

      if (this.selecionadoCor != null) {
        filtros.push({
          nomeCampo: 'DS_COR_RACA',
          operacao: '==',
          valorCampo: this.selecionadoCor
        });
      }

      if (this.selecionadoPartido != null) {
        filtros.push({
          nomeCampo: 'SG_PARTIDO',
          operacao: '==',
          valorCampo: this.selecionadoPartido
        });
      }

      if (this.selecionadoCargo != null) {
        filtros.push({
          nomeCampo: 'DS_CARGO',
          operacao: '==',
          valorCampo: this.selecionadoCargo
        });
      }

      let collection = 'Canditatos_' + this.selecionadosUf;
      collection += this.selecionadoAno === '2018' ? '_18' : '';
      const dados = await firebaseDb().query(collection, filtros);
      this.candidatos = dados.map(candidato => {
        return { 
          nome: candidato['NM_URNA_CANDIDATO'],
          cor: candidato['DS_COR_RACA'],
          genero: candidato['DS_GENERO'],
          grau_de_instrucao: candidato['DS_GRAU_INSTRUCAO'],
          idade: candidato['NR_IDADE_DATA_POSSE'],
          nome_do_partido: candidato['NM_PARTIDO'],
          sigla_do_partido: candidato['SG_PARTIDO'],
          uf: candidato['SG_UF'],
          sq_candidato: candidato['SQ_CANDIDATO'],
          st_declarar_bens: candidato['ST_DECLARAR_BENS'],
          gastos_campanha_2018: this.selecionadoAno === '2018' ? candidato['VR_DESPESA_MAX_CAMPANHA'] : 0,
          gastos_campanha_2022: this.selecionadoAno === '2022' ? candidato['VR_DESPESA_MAX_CAMPANHA'] : 0,
          cargo: candidato['DS_CARGO'],
          numero_urna: candidato['NR_CANDIDATO']
        };
      });
    }
  },
  watch: {
    selecionadoAno() {
      this.getCandidatos();
    },
    selecionadoGenero() {
      this.getCandidatos();
    },
    selecionadoEscolaridade() {
      this.getCandidatos();
    },
    selecionadoCor() {
      this.getCandidatos();
    },
    selecionadoPartido() {
      this.getCandidatos();
    },
    selecionadosUf() {
      this.getCandidatos();
    },
    selecionadoCargo() {
      this.getCandidatos();
    }
  }
}
</script>

<style>
</style>