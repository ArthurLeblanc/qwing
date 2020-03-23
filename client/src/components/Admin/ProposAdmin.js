import React from "react";
import { Header } from "../Permanent/Header"
import API from "../../utils/API";
import { Button } from "react-bootstrap";
import { MDBBtn, MDBDataTable, MDBTableBody, MDBTableHead  } from 'mdbreact';

export class ProposAdmin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          allPropos : [],
          //data: {columns:[], rows:[]}
          }
        this.getAllPropos();
    }

    getAllPropos = async() => {
        const callPropos = await API.getAllPropos();
        this.setState({allPropos : callPropos.data})
    }

    deletePropos = (proposId) => {
        API.deletePropos({"proposId" : proposId})
        alert("Propos supprimé !")
    }

    fillProposDatatable = (allPropos) => {
        var data = {columns:[], rows: []}
        allPropos.map
        ( (propos) => 
          {
             data.rows.push({
                'id': propos._id,
                'contenu': propos.contenu,
                'catégorie': propos.categorie.contenu,
                'likes': propos.likes,
                'creator': propos.creator ? propos.creator.email : 'Anonyme',
                'action': <MDBBtn onClick={() => { this.deletePropos(propos._id) }} color="default" rounded size="sm">Supprimer</MDBBtn>
            })
        })
        return data
    }

    render() {
        const { allPropos } = this.state;
        var data = this.fillProposDatatable(allPropos)
        const columns= [
            {
              label: '#',
              field: 'id',
              sort: 'asc'
            },
            {
              label: 'Contenu',
              field: 'contenu',
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
            <h2>Gérer les propos</h2>
            <div className="divider"/>
            <div className="container">
                <MDBDataTable btn striped hover data={data} />
            </div>
        </div>
        )
    }
}