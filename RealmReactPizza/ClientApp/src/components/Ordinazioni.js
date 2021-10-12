import React, { Component } from 'react';

export class Ordinazioni extends Component {
    static displayName = Ordinazioni.name;

    constructor(props) {
        super(props);
        this.state = { ordini: [], loading: true };
    }

    componentDidMount() {
        this.CaricaOrdini();
    }

    static renderOrdiniTable(ordini) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Pizza</th>
                        <th>Quantità</th>
                    </tr>
                </thead>
                <tbody>
                    {ordini.map(ordine =>
                        <tr key={ordine.ID}>
                            <td>{ordine.ordine.utente.username}</td>
                            <td>{ordine.pizza.nome}</td>
                            <td>{ordine.quantita}</td>      
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Ordinazioni.renderOrdiniTable(this.state.ordini);

        return (
            <div>
                <h1 id="tabelLabel">Ordinazioni</h1>
                <p>Elenco delle pizze da realizzare...</p>
                {contents}
            </div>
        );
    }

    async CaricaOrdini() {
        const response = await fetch('ordinazioni');
        const data = await response.json();
        this.setState({ ordini: data, loading: false });
    }
}
