import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacao, Negociacoes } from '../models/index';
import { domInject } from '../helpers/decorators/domInject';

export class NegociacaoController{

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;
     
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemview = new MensagemView('#mensagemView')

    constructor(){
        this._negociacoesView.update(this._negociacoes);
    }

    adiciona(event: Event){
        event.preventDefault();

        let data = new Date(this._inputData.val().replace(/-/g, ','));

        if(!this._ehDiaUtil(data)){
            this._mensagemview.update('Somente cadastre negociações em dias úteis.');
            return;
        }

        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        )

        this._negociacoes.adiciona(negociacao);
        
        this._negociacoesView.update(this._negociacoes);
        this._mensagemview.update('Negociação adicionada com sucesso.')
    }

    private _ehDiaUtil(data: Date){
        return data.getDay() != DiaDaSemana.domingo && data.getDay() !== DiaDaSemana.sabado;
    }
}

enum DiaDaSemana{
    domingo, segunda, terca, quarta, quinta, sexta, sabado
}