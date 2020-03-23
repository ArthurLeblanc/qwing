import React from "react";
import { Header } from "../Permanent/Header"
import API from "../../utils/API";
import { Button } from "react-bootstrap";
import { MDBBtn, MDBDataTable, MDBTableBody, MDBTableHead  } from 'mdbreact';

export class ReponsesAdmin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          allReponses : [],
          //data: {columns:[], rows:[]}
          }
        this.getAllReponses();
    }

    getAllReponses = async() => {
        const callReponses = await API.getAllReponses();
        this.setState({allReponses : callReponses.data})
    }

    deleteReponse = (reponseId) => {
        API.deleteReponse({"reponseId" : reponseId})
        alert("Réponse supprimée !")
    }

    fillReponsesDatatable = (allReponses) => {
        var data = {columns:[], rows: []}
        allReponses.map
        ( (reponse) => 
          {
             data.rows.push({
                'id': reponse._id,
                'propos': reponse.propos ? reponse.propos.contenu : "null",
                'reponse': reponse.contenu,
                'catégorie': reponse.categorie.contenu,
                'likes': reponse.likes,
                'dislikes': reponse.dislikes,
                'creator': reponse.creator ? reponse.creator.email : 'Anonyme',
                'action': <MDBBtn onClick={() => { this.deleteReponse(reponse._id) }} color="default" rounded size="sm">Supprimer</MDBBtn>
            })
        })
        return data
    }

    render() {
        const { allReponses } = this.state;
        var data = this.fillReponsesDatatable(allReponses)
        const columns= [
            {
              label: '#',
              field: 'id',
              sort: 'asc'
            },
            {
              label: 'Propos',
              field: 'propos',
              sort: 'asc'
            },
            {
              label: 'Réponse',
              field: 'reponse',
              sort: 'asc'
            },
            {
              label: 'Catégorie',
              field: 'catégorie',
              sort: 'asc'
            },
            {
              label: 'Likes',
              field: 'likes',
              sort: 'asc'
            },
            {
              label: 'Dislikes',
              field: 'dislikes',
              sort: 'asc'
            },
            {
              label: 'Creator',
              field: 'creator',
              sort: 'asc'
            },
            {
              label: 'Action',
              field: 'action',
            }
          ];
          data.columns = columns

        return (
        <div>
            <Header />
            <h2>Gérer les réponses</h2>
            <div className="divider"/>
            <div className="container">
                <MDBDataTable btn striped hover data={data} />
            </div>
        </div>
        )
    }
}