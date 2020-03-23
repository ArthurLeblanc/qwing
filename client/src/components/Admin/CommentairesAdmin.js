import React from "react";
import { Header } from "../Permanent/Header"
import API from "../../utils/API";
import { Button } from "react-bootstrap";
import { MDBBtn, MDBDataTable, MDBTableBody, MDBTableHead  } from 'mdbreact';

export class CommentairesAdmin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          allCommentaires : [],
          //data: {columns:[], rows:[]}
          }
        this.getAllCommentaires();
    }

    getAllCommentaires = async() => {
        const callCommentaires = await API.getAllCommentaires();
        this.setState({allCommentaires : callCommentaires.data})
    }

    deleteCommentaire = (commentaireId) => {
        API.deleteCommentaire({"commentaireId" : commentaireId})
        alert("Réponse supprimée !")
    }

    fillCommentairesDatatable = (allCommentaires) => {
        var data = {columns:[], rows: []}
        allCommentaires.map
        ( (commentaire) => 
          {
             data.rows.push({
                'id': commentaire._id,
                'propos': commentaire.propos ? commentaire.propos.contenu : "null",
                'commentaire': commentaire.contenu,
                'likes': commentaire.likes,
                'dislikes': commentaire.dislikes,
                'creator': commentaire.creator ? commentaire.creator.email : 'Anonyme',
                'action': <MDBBtn onClick={() => { this.deleteCommentaire(commentaire._id) }} color="default" rounded size="sm">Supprimer</MDBBtn>
            })
        })
        return data
    }

    render() {
        const { allCommentaires } = this.state;
        var data = this.fillCommentairesDatatable(allCommentaires)
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
              label: 'Commentaire',
              field: 'commentaire',
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
            <h2>Gérer les commentaires</h2>
            <div className="divider"/>
            <div className="container">
                <MDBDataTable btn striped hover data={data} />
            </div>
        </div>
        )
    }
}