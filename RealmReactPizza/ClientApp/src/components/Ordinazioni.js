import React, { Component } from 'react';
import * as Realm from 'realm-web'

export class Ordinazioni extends Component {
  static displayName = Ordinazioni.name;

  constructor(props) {
    super(props);
    this.state = { ordinazioni: [], loading: true };
  }

  componentDidMount() {
    this.populateOrdinazioniData();
  }

  static renderOrdinazioniTable(ordinazioni) {
      return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Utente</th>
            <th>Pizza</th>
            <th>Quantita</th>
          </tr>
        </thead>
        <tbody>
            {ordinazioni.map(ordine =>
                <tr key={ordine._id}>
                    <td>{ordine.Utente}</td>
                    <td>{ordine.Pizza}</td>
                    <td>{ordine.Quantita}</td>
                </tr>
            )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
        : Ordinazioni.renderOrdinazioniTable(this.state.ordinazioni);

    return (
      <div>
        <h1 id="tabelLabel" >Ordinazioni</h1>
        <p>Lista delle ordinazioni in tempo Realm... :D</p>
        {contents}
      </div>
    );
  }

  async populateOrdinazioniData() {
        const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID });
        const user = await app.logIn(Realm.Credentials.anonymous());
        const client = user.mongoClient('mongodb-atlas');
        const ordini = client.db('PizzAppDB').collection('Ordine');

        const ordiniFiltro = await ordini.find({ _partition: process.env.REACT_APP_REALM_PARTITION, Chiuso: false, Confermato: true  });

        const righeOrdine = client.db('PizzAppDB').collection('RigaOrdine');
        const pizze = client.db('PizzAppDB').collection('Pizza');
        const utenti = client.db('PizzAppDB').collection('Utente');


        var listaOrdinazioni = new Array();
        var i = 0;
        for (i = 0; i < ordiniFiltro.length; i++) {

            const righeOrdineFiltro = await righeOrdine.find({ _partition: process.env.REACT_APP_REALM_PARTITION, Ordine: ordiniFiltro[i]._id });

            var j = 0;
            for (j = 0; j < righeOrdineFiltro.length; j++) {

                const pizza = await pizze.findOne({ _partition: process.env.REACT_APP_REALM_PARTITION, _id: righeOrdineFiltro[j].Pizza });
                const utente = await utenti.findOne({ _partition: process.env.REACT_APP_REALM_PARTITION, _id: ordiniFiltro[i].Utente });

                var ordine = new Object();
                ordine._id = righeOrdineFiltro[j]._id;
                ordine.Quantita = righeOrdineFiltro[j].Quantita;
                ordine.Pizza = pizza.Nome;
                ordine.Utente = utente.Username;
                listaOrdinazioni.push(ordine);

            }
        }       

        this.setState({ ordinazioni: listaOrdinazioni, loading: false });
  }
}
