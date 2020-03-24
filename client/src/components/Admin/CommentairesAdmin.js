import React from "react";
import ReactDOM from "react-dom";
import { Header } from "../Permanent/Header"
import API from "../../utils/API";
import MUIDataTable from "mui-datatables";
import M from 'materialize-css';

export class CommentairesAdmin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          allCommentaires : [],
          data: {columns:[], rows:[]}
          }
          this.getAllCommentaires = this.getAllCommentaires.bind(this)
          this.fillCommentairesDatatable = this.fillCommentairesDatatable.bind(this)
          this.getAllCommentaires();
    }

    getAllCommentaires = async() => {
        const callCommentaires = await API.getAllCommentaires();
        this.setState({allCommentaires : callCommentaires.data})
        const v = this.fillCommentairesDatatable()
        this.setState({data : v})
    }

    deleteCommentaire = (index) => {
      var array = this.state.data.rows
      let commentaireId = array[index][0]
      API.deleteCommentaire({"commentaireId" : commentaireId})
      M.toast({html: "Commentaire supprimé !" ,classes: "green"})
    }

    fillCommentairesDatatable = () => {
        const {allCommentaires} = this.state
        var cdata = {columns:[], rows: []}
        allCommentaires.map
        ( (commentaire) => 
          {
             cdata.rows.push([
                commentaire._id,
                commentaire.propos ? commentaire.propos.contenu : "null",
                commentaire.contenu,
                commentaire.likes,
                commentaire.dislikes,
                commentaire.creator ? commentaire.creator.email : 'Anonyme'
             ])
        })
        return cdata
    }

    render() {
        const { data } = this.state;
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
          const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRowsOnClick : "true",
            onRowsDelete : (d) => d.data.map( (com) => { this.deleteCommentaire(com.dataIndex) })
          };
        return (
        <div>
            <Header />
            <h2>Gérer les commentaires</h2>
            <div className="divider"/>
            <div className="container">
              <MUIDataTable
                  title={"Liste des propos"}
                  data={data.rows}
                  columns={data.columns}
                  options={options}
              />
            </div>
        </div>
        )
    }
}