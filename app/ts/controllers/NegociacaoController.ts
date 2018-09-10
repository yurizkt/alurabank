import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacao, Negociacoes } from '../models/index';
import { domInject, throttle } from '../helpers/index';
import { NegociacaoService } from '../services/index';
import { imprime } from '../helpers/index';

export class NegociacaoController{

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;
     
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');

    private _service = new NegociacaoService();

    constructor(){
        this._negociacoesView.update(this._negociacoes);
    }
    @throttle()
    adiciona(event: Event){

        let data = new Date(this._inputData.val().replace(/-/g, ','));

        if(!this._ehDiaUtil(data)){
            this._mensagemView.update('Somente cadastre negociações em dias úteis.');
            return;
        }

        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        )

        this._negociacoes.adiciona(negociacao);
        
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso.');

        imprime(negociacao, this._negociacoes);
    }

    private _ehDiaUtil(data: Date){
        return data.getDay() != DiaDaSemana.domingo && data.getDay() !== DiaDaSemana.sabado;
    }

    @throttle()
    async importaDados() {

        try{
            const negociacoesParaImportar = await this._service
            .obterNegociacoes(res => {
                if(res.ok) return res;
                throw new Error(res.statusText);
            });

            const negociacoesJaImportadas = this._negociacoes.paraArray();

            negociacoesParaImportar
                .filter((negociacao: any) => 
                    !negociacoesJaImportadas.some(jaImportada => 
                        negociacao.ehIgual(jaImportada)))
                .forEach((negociacao: any) => 
                    this._negociacoes.adiciona(negociacao));

            this._negociacoesView.update(this._negociacoes);

        } catch(err){
            this._mensagemView.update(err.message);
        }

    }
}

enum DiaDaSemana{
    domingo, segunda, terca, quarta, quinta, sexta, sabado
}