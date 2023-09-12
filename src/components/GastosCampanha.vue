<template>
  <div v-if="candidatoSelecionado != null" class="mb-5">
    <h2>Gastos de campanha por candidato(a) e partido</h2>
    <div class="d-flex mb-2">
      <div 
        class="shadow-sm mr-2 bg-white w-50 px-5 py-3 border border-info"
        style="border-radius: 20px;"
      >
        <img 
          :src="selecionarLogo(candidatoSelecionado['sigla_do_partido'])"
          width="200" 
        />
        <p class="mt-2">
          <span class="mr-2">Total das últimas duas eleições:</span>
          <strong class="text-success">
            R$ {{ formatarNumero(totalPartido2018+totalPartido2022) }}
          </strong>
        </p>
      </div>
      <div 
        class="shadow-sm bg-white w-50 px-5 py-3 border border-info"
        style="border-radius: 20px;"
      >
        <strong>{{ candidatoSelecionado.nome }}</strong>
        <hr class="bg-info"/>
        <div v-if="existemGastos">
          <div class="d-flex justify-content-between mb-1">
            <div class="text-left w-75">
              <p>
                Total de campanha do candidato das últimas duas eleições:
              </p> 
            </div>
            <div class="text-end">
              <p>
                <strong class="text-success">
                  R$ {{ formatarNumero(totalCandidato) }}
                </strong>
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Não foram encontrados gastos de campanha.</p>
        </div>
      </div>
    </div>
    <div class="d-flex">
      <div 
        class="shadow-sm mr-2 bg-white w-50 px-5 py-3 border border-info"
        style="border-radius: 20px;"
      >
         <GraficoGastosCampanha 
          :candidato-selecionado="{
            nome: candidatoSelecionado.sigla_do_partido, 
            gastos_campanha_2018: totalPartido2018,
            gastos_campanha_2022: totalPartido2022
          }"
        />
      </div>
      <div
        class="shadow-sm bg-white w-50 px-5 py-3 border border-info"
        style="border-radius: 20px;"
      >
         <GraficoGastosCampanha 
          :candidato-selecionado="candidatoSelecionado"
          @atualizarTotalCandidato="atualizarTotalCandidato"
        />
      </div>
    </div>
  </div>
</template>

<script>
import GraficoGastosCampanha from './GraficoGastosCampanha.vue';
import GASTOS_POR_PARTIDO_2018 from '../gastos_por_partido_2018';
import GASTOS_POR_PARTIDO_2022 from '../gastos_por_partido_2022';
import Utils from '../utils';
import mdbLogo from '../assets/mdb.webp';
import ptLogo from '../assets/pt.png';
import psdbLogo from '../assets/psdb.png';
import ppLogo from '../assets/pp.jpg';
import pdtLogo from '../assets/pdt.jpeg';
import uniaoLogo from '../assets/uniao.png';
import ptbLogo from '../assets/ptb.png';
import podemosLogo from '../assets/podemos.png';
import plLogo from '../assets/pl.png';
import psbLogo from '../assets/psb.png';
import republicanosLogo from '../assets/republicanos.webp';
import cidadaniaLogo from '../assets/cidadania.jpeg';
import psdLogo from '../assets/psd.png';
import pcdobLogo from '../assets/pcdob.png';
import solidariedadeLogo from '../assets/solidariedade.png';
import pvLogo from '../assets/pv.png';
import patriotaLogo from '../assets/patriota.png';
import psolLogo from '../assets/psol.png';
import avanteLogo from '../assets/avante.webp';
import pmnLogo from '../assets/pmn.png';
import agirLogo from '../assets/agir.png';
import dcLogo from '../assets/dc.png';
import prtbLogo from '../assets/prtb.jpg';
import pmbLogo from '../assets/pmb.webp';
import redeLogo from '../assets/rede.jpg';
import novoLogo from '../assets/novo.png';
import pstuLogo from '../assets/pstu.png';
import pcbLogo from '../assets/pcb.png';
import upLogo from '../assets/up.png';
import pcoLogo from '../assets/pco.png';

export default {
  components: {
    GraficoGastosCampanha
  },
  props: {
    candidatoSelecionado: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      totalPartido2018: 1,
      totalPartido2022: 1,
      totalCandidato: 0,
      mdbLogo,
      logoPartido: ''
    }
  },
  methods: {
    atualizarTotalCandidato(total) {
      this.totalCandidato = total;
    },
    formatarNumero(numero) {
      if (numero == 2) return 0;
      return Utils().formatarNumero(numero);
    },
    selecionarLogo(partido) {
      const partidos = {
        'MDB': mdbLogo,
        'PT': ptLogo,
        'PSDB': psdbLogo,
        'PP': ppLogo,
        'PDT': pdtLogo,
        'UNIÃO': uniaoLogo,
        'PTB': ptbLogo,
        'PODE': podemosLogo,
        'PL': plLogo,
        'PSB': psbLogo,
        'REPUBLICANOS': republicanosLogo,
        'CIDADANIA': cidadaniaLogo,
        'PSD': psdLogo,
        'PCDOB': pcdobLogo,
        'SOLIDARIEDADE': solidariedadeLogo,
        'PV': pvLogo,
        'PATRIOTA': patriotaLogo,
        'PSOL': psolLogo,
        'AVANTE': avanteLogo,
        'PMN': pmnLogo,
        'AGIR': agirLogo,
        'DC': dcLogo,
        'PRTB': prtbLogo,
        'PMB': pmbLogo,
        'REDE': redeLogo,
        'NOVO': novoLogo,
        'PSTU': pstuLogo,
        'PCB': pcbLogo,
        'UP': upLogo,
        'PCO': pcoLogo
      };

      return partidos[partido];
    }
  },
  watch: {
    candidatoSelecionado(valorAtual) {
      this.totalPartido2018 = GASTOS_POR_PARTIDO_2018[valorAtual['sigla_do_partido']];
      this.totalPartido2022 = GASTOS_POR_PARTIDO_2022[valorAtual['sigla_do_partido']];
    }
  },
  computed: {
    percentualCandidato() {
      if (this.candidatoSelecionado == null) {
        return 0;
      }

      if (this.candidatoSelecionado.gastos_campanha_2018 != 0) {
        return parseFloat(this.candidatoSelecionado['gastos_campanha_2018'].toString().replace(',','.')) / this.totalPartido2018;
      } else {
        return parseFloat(this.candidatoSelecionado['gastos_campanha_2022'].toString().replace(',','.')) / this.totalPartido2022;
      }
    },
    existemGastos() {
      return this.candidatoSelecionado['gastos_campanha_2018'] != -1
          || this.candidatoSelecionado['gastos_campanha_2022'] != -1
    }
  }
}
</script>
