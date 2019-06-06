import { Component, OnInit } from '@angular/core';
import { CampanhaService } from './campanha.service';
import { MatTableModule, MatTableDataSource } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';

import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { element } from 'protractor';
import { ɵELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser';


class Campanha {
  ID: number;
  MIDIA: string;
  FINALIZADA: string;
  DATA_INICIO: Date;
  DATA_TERMINO: Date;
  funcionarios: Funcionario[] | null;
  produtos: Produto[] | null;
  VARIAÇÃO_VENDAS: number;
  variacao: number;

  gerenteId: number;
  custo: number;
}

class Funcionario {
  Id: string;
  idN: number;
  Nome: string;
  papel: string;
}

class Produto {
  id: number;
  codprod: number;
  nomeprod: string;

  mediaVenda: number;
  vendidosTotal: number;
  vendidosCampanha: number;
}

class Venda {
  idvenda: any;
  codprod: number;
  dtvenda: Date;
  qtdvenda: number;
}

class Despesa {
  id: number;
  datafinal: Date;
  datainicial: Date;
  origem: string;
  valor: number;
}

class Reclamacao {
  id: number;
  status: string;
  setor: string;
}

@Component({
  selector: 'app-campanha',
  templateUrl: './campanha.component.html',
  styleUrls: ['./campanha.component.css']
})
export class CampanhaComponent implements OnInit {
  campanhas: Campanha[];
  funcionarios: Funcionario[];
  produtos: Produto[] = [];
  vendas: Venda[] = [];
  despesas: Despesa[] = [];
  loadCamp = false;

  recl: Reclamacao[] = [];
  reclS = 0;
  reclN = 0;
  reclPend = 0;
  loadMelhoria = false;
  //grafico
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [['Sim'], ['Não'], 'Pendente'];
  public pieChartData: number[];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  constructor(private campanhaService: CampanhaService) { }

  ngOnInit() {
    this.campanhaService.requestDataFromMultipleSources().subscribe(responseList => {
      this.campanhas = responseList[0];
      this.despesas = responseList[1];
      this.funcionarios = responseList[2];
      this.produtos = responseList[3];
      this.vendas = responseList[4];

      let idFunc = 0;
      this.funcionarios.forEach(element => {
        element.idN = idFunc
        idFunc++;
      });

      this.campanhas.forEach(e => {
        e.DATA_INICIO = new Date(e.DATA_INICIO);
        e.DATA_TERMINO = new Date(e.DATA_TERMINO);
        e.variacao = e.VARIAÇÃO_VENDAS;
      })

      this.vendas.forEach(element => {
        element.dtvenda = new Date(element.dtvenda);
      });

      this.despesas.forEach(element => {
        if (element.origem = "Marketing") {
          this.despesas.push(element);
        }
      });

      for (let i = 0; i < this.campanhas.length; i++) {
        this.campanhas[i].custo = this.despesas[i].valor;
      }
      this.setData();
      this.loadCamp = true;
    });

    this.campanhaService.requestReclamacoes().subscribe(respRecl => {
      let id: number = 0;
      respRecl.forEach(ele => {
        if (ele.Descricao != undefined) {
          let r = { id: id, status: ele.Descricao, setor: "Financeiro" }
          this.recl.push(r)
          if (r.status == "Sim") this.reclS++;
          if (r.status == "Pendente") this.reclPend++;
          if (r.status == "Não") this.reclN++;
        }

        if (ele.Melhoria != undefined) {
          let r = { id: id, status: ele.Melhoria, setor: "RH" }
          this.recl.push(r)
          if (r.status == "Sim") this.reclS++;
          if (r.status == "Pendente") this.reclPend++;
          if (r.status == "Não") this.reclN++;
        }
      });
      this.pieChartData = [this.reclS, this.reclN, this.reclPend];

      for (let i = 0; i < this.pieChartData.length; i++) {
        this.pieChartLabels[i] += "\t" + (this.pieChartData[i] / this.recl.length * 100) + "%".toString();
      }

      this.loadMelhoria = true;
    });
  }

  setData() {
    this.campanhas.forEach(campanha => {

      campanha.funcionarios = [];
      for (let i = 0; i < 3; i++) {
        let func: Funcionario = this.funcionarios[Math.floor(Math.random() * this.funcionarios.length)]
        while (campanha.funcionarios.find(f => f.idN == func.idN)) {
          func = this.funcionarios[Math.floor(Math.random() * this.funcionarios.length)]
        }
        if (i == 0) {
          campanha.gerenteId = func.idN;
        }
        campanha.funcionarios.push(func);
      }

      campanha.produtos = [];
      for (let i = 0; i < 4; i++)
        campanha.produtos.push(this.produtos[Math.floor(Math.random() * this.produtos.length)]);

      campanha.produtos.forEach(p => {
        this.vendas.forEach(v => {
          if (v.codprod == p.codprod && (campanha.DATA_INICIO < v.dtvenda && campanha.DATA_TERMINO > v.dtvenda)) {
            p.vendidosCampanha++;
          }
        });
      });
    });

    console.log(this.campanhas);
  }


  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  addSlice() {
    this.pieChartLabels.push(['Line 1', 'Line 2', 'Line 3']);
    this.pieChartData.push(400);
    this.pieChartColors[0].backgroundColor.push('rgba(196,79,244,0.3)');
  }

  removeSlice() {
    this.pieChartLabels.pop();
    this.pieChartData.pop();
    this.pieChartColors[0].backgroundColor.pop();
  }

  changeLegendPosition() {
    this.pieChartOptions.legend.position = this.pieChartOptions.legend.position === 'left' ? 'top' : 'left';
  }

}
