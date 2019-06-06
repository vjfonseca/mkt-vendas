import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';  
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CampanhaService {
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) { }

  // // // dev
  // campanhas = "https://cors-anywhere.herokuapp.com/http://sigemv.ml/api/campanhas";
  // produtos = "https://cors-anywhere.herokuapp.com/https://webapiproducaov3.azurewebsites.net/api/item";
  // funcionarios = "https://cors-anywhere.herokuapp.com/http://apisigerecursoshumanos.azurewebsites.net/api/pessoa/ObterFuncionariosSalarioArea";
  // vendas = "https://cors-anywhere.herokuapp.com/https://webapiproducaov3.azurewebsites.net/api/vendas";
  // despesas = "https://cors-anywhere.herokuapp.com/http://sigefinanceiroapi.azurewebsites.net/Financeiro/GetContasAPagar";
  // reclamaçõesRH = "https://cors-anywhere.herokuapp.com/http://apisigerecursoshumanos.azurewebsites.net/api/Pessoa/ReceberReclamacao?reclamacao=aaa";
  // reclamaçõesFinanceiro = "https://cors-anywhere.herokuapp.com/http://sigefinanceiroapi.azurewebsites.net/Financeiro/GetObterRespostaMelhoriaContinua?reclamacao=reclamacao";

  // prod
  campanhas = "http://sigemv.ml/api/campanhas";
  produtos = "https://webapiproducaov3.azurewebsites.net/api/item";
  funcionarios = "http://apisigerecursoshumanos.azurewebsites.net/api/pessoa/ObterFuncionariosSalarioArea";
  vendas = "https://webapiproducaov3.azurewebsites.net/api/vendas";
  despesas = "http://sigefinanceiroapi.azurewebsites.net/Financeiro/GetContasAPagar";
  reclamaçõesRH = "http://apisigerecursoshumanos.azurewebsites.net/api/Pessoa/ReceberReclamacao?reclamacao=aaa";
  reclamaçõesFinanceiro = "http://sigefinanceiroapi.azurewebsites.net/Financeiro/GetObterRespostaMelhoriaContinua?reclamacao=reclamacao";

  public requestDataFromMultipleSources(): Observable<any[]> {
    let response1 = this.http.get(this.campanhas);
    let response2 = this.http.get(this.despesas);
    let response3 = this.http.get(this.funcionarios);
    let response4 = this.http.get(this.produtos);
    let response5 = this.http.get(this.vendas);
    return forkJoin([response1, response2, response3, response4, response5]);
  }

  public requestReclamacoes(): Observable<any[]> {
    let req: Observable<any[50]>[] = [];
    let i = 0;
    for(; i<5; i++){
      req[i] = this.http.get(this.reclamaçõesFinanceiro);
    }
    for(; i<10; i++){
      req[i] = this.http.get(this.reclamaçõesRH);
    }
    return forkJoin(req);
  }
}
