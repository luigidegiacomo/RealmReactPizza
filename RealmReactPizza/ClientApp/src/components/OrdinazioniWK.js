import React, { Component } from 'react';
import * as Realm from 'realm-web'

export class OrdinazioniWK extends Component {
    static displayName = OrdinazioniWK.name;

  constructor(props) {
    super(props);
    this.state = { ordinazioni: [], loading: true };
  }

  componentDidMount() {
    this.populateOrdinazioniData();
  }

  static renderOrdinazioniTable(ordini) {
      return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th width="10%">Pizza</th>
            <th></th>
            <th>Quantità</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
            {ordini.map(ordine =>
                <tr key={ordine.ID}>
                    <td><img width="100" src={ordine.PathImg} /></td>
                    <td>{ordine.Pizza}</td>
                    <td>{ordine.Quantita}</td>
                    <td>{ordine.Utente}</td>
                </tr>
            )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
        : OrdinazioniWK.renderOrdinazioniTable(this.state.ordinazioni);

    return (
      <div>
        <h1 id="tabelLabel" >Ordinazioni WebKit</h1>
        <p>Lista delle ordinazioni in tempo Realm... :D</p>
        {contents}
      </div>
    );
  }

  async populateOrdinazioniData() {
        const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID });

        const user = await app.logIn(Realm.Credentials.anonymous());
        //const user = await app.logIn(Realm.Credentials.emailPassword("pizzapp@pizzapp.it","pizzapp"));
        const client = user.mongoClient('mongodb-atlas');
        const ordini = client.db(process.env.REACT_APP_REALM_APP_DB).collection('Ordine');

        const ordiniFiltro = await ordini.find({ _partition: process.env.REACT_APP_REALM_PARTITION, Chiuso: false, Confermato: true });        

        const righeOrdine = client.db(process.env.REACT_APP_REALM_APP_DB).collection('RigaOrdine');
        const pizze = client.db(process.env.REACT_APP_REALM_APP_DB).collection('Pizza');
        const utenti = client.db(process.env.REACT_APP_REALM_APP_DB).collection('Utente');
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
                if(j==0) ordine.Utente = utente.Username;
                ordine.Quantita = righeOrdineFiltro[j].Quantita;
                ordine.Pizza = pizza.Nome;
                ordine.PathImg = pizza.PathImg;
                listaOrdinazioni.push(ordine);

            }
        }       

        this.setState({ ordinazioni: listaOrdinazioni, loading: false });
  }
}
